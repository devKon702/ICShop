import { nanoid } from "nanoid";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { Role } from "../constants/db";
import { HttpStatus } from "../constants/http-status";
import { AppError } from "../errors/app.error";
import accountRepository from "../repositories/account.repository";
import { compareString, hashString } from "../utils/bcrypt.util";
import jwtService, { RefreshTokenPayload } from "./jwt.service";
import { JWTConfig } from "../constants/jwt-config";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { env } from "../constants/env";
import storage from "../storage";
import { logger } from "../utils/logger.util";
import { JWTResponseCode } from "../constants/codes/jwt.code";
import { JWTError } from "../errors/jwt.error";
import sessionRepository from "../repositories/session.repository";
import redisService, { redisKeys } from "./redis.service";
import sessionService from "./session.service";
import crypto from "crypto";
import mailService from "./mail.service";
import { generateResetPasswordHtml } from "../utils/html.util";
import { OtpChannel, otpPolicies, OtpPurpose, otpService } from "./otp";

class AuthService {
  private createCookieToken = (res: Response, token: string, role: Role) => {
    switch (role) {
      // Tạo cookie thường
      case Role.USER:
        res.cookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, token, {
          httpOnly: true,
          path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
          sameSite: "none",
          secure: true,
          maxAge: JWTConfig.JWT_REFRESH_EXPIRE_USER * 1000,
        });
        break;
      case Role.ADMIN:
      default:
        // Tạo session cookie
        res.cookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          // domain: ".localhost",
          path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
        });
        break;
    }
  };

  private clearCookieToken = (res: Response) => {
    // Xóa cookie, truyền option giống với khi tạo cookie
    res.clearCookie(JWTConfig.JWT_REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      path: JWTConfig.JWT_REFRESH_COOKIE_PATH,
    });
  };

  public async login(args: {
    res: Response;
    email: string;
    password: string;
    captchaToken: string;
    role: Role;
  }) {
    const { res, email, password, captchaToken, role } = args;

    const account = await accountRepository.findByEmail(email, role);
    // Account not found
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AuthResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
        true,
      );
    }
    // Wrong password, including case password null with google signup
    if (
      !account.password ||
      !(await compareString(password, account.password))
    ) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        AuthResponseCode.WRONG_PASSWORD,
        "Sai mật khẩu",
        true,
      );
    }
    // Account is blocked
    if (!account.isActive) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AuthResponseCode.USER_BLOCKED,
        "Tài khoản đã bị khóa",
        true,
      );
    }
    // Success
    const refreshJti = nanoid();
    const sessionId = nanoid();
    const { token: refreshToken, expiresAt: refreshExpiresAt } =
      jwtService.createRefreshToken({
        sub: account.user!.id,
        role,
        jti: refreshJti,
        sessionId: sessionId,
        version: 1,
      });
    const { token: accessToken } = jwtService.createAccessToken({
      sub: account.user!.id,
      role,
      sessionId: sessionId,
      sessionVersion: 1,
    });
    // Save session to database and redis
    await sessionService.saveNewSession({
      sessionId,
      refreshJti,
      userId: account.user!.id,
      refreshExpiresAt: new Date(refreshExpiresAt),
    });
    // Create cookie storage for refresh token
    this.createCookieToken(res, refreshToken, role);
    return { accessToken, refreshToken, account };
  }

  public loginWithGoogle = async (res: Response, token: string) => {
    // Verify google token
    const googleClient = new OAuth2Client({
      clientId: env.GOOGLE_CLIENT_ID,
    });
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        AuthResponseCode.INVALID_GOOGLE_TOKEN,
        "Token Google không hợp lệ",
        true,
      );
    }
    const { email, name, picture } = payload;
    let account = await accountRepository.findByEmail(email);
    // If existing account is not user
    if (account && account.role !== Role.USER) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AuthResponseCode.FORBIDDEN,
        "Không thể đăng nhập với email này",
        true,
      );
    }
    let isComeback = true;
    if (!account) {
      isComeback = false;
      // Auto signup
      let avatarUrl: string | undefined = undefined;
      if (picture) {
        // Download picture from google and upload to storage
        try {
          const googlePicture = await fetch(picture);
          const buffer = Buffer.from(await googlePicture.arrayBuffer());
          avatarUrl = await storage.save(
            buffer,
            String(Date.now()),
            "image/jpeg",
          );
        } catch (error) {
          logger.error("Failed to fetch/upload google avatar picture", error);
        }
      }

      // Create account
      account = await accountRepository.create({
        email: email,
        password: null,
        name: name || email.split("@")[0],
        avatarUrl,
        provider: "google",
        emailVerified: true,
        role: Role.USER,
      });
    }
    // Check if account is active, for checking existing account
    if (!account.isActive) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AuthResponseCode.USER_BLOCKED,
        "Tài khoản đã bị khóa",
        true,
      );
    }
    // Generate token for new/existing account
    const refreshJti = nanoid();
    const sessionId = nanoid();
    const { token: refreshToken, expiresAt: refreshExpiresAt } =
      jwtService.createRefreshToken({
        sub: account.user!.id,
        role: Role.USER,
        jti: refreshJti,
        sessionId: sessionId,
        version: 1,
      });
    const { token: accessToken } = jwtService.createAccessToken({
      sub: account.user!.id,
      role: Role.USER,
      sessionId: sessionId,
      sessionVersion: 1,
    });

    // Save session to database and redis
    await sessionService.saveNewSession({
      sessionId,
      refreshJti,
      userId: account.user!.id,
      refreshExpiresAt: new Date(refreshExpiresAt),
    });
    // Create cookie storage for refresh token
    this.createCookieToken(res, refreshToken, Role.USER);
    return { accessToken, refreshToken, account, isComeback };
  };

  public signup = async ({
    email,
    password,
    name,
    phone,
    otp,
  }: {
    email: string;
    password: string;
    name: string;
    phone: string;
    otp: string;
  }) => {
    // Verify OTP
    const savePayload = await otpService.verifyOtp({
      channel: OtpChannel.EMAIL,
      target: email,
      code: otp,
      purpose: OtpPurpose.VERIFY_EMAIL_REGISTER,
    });
    if (!savePayload) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        AuthResponseCode.INVALID_OTP,
        "Mã OTP không hợp lệ",
        true,
      );
    }
    const existAccount = await accountRepository.findByEmail(email);
    // If email already exists
    if (existAccount)
      throw new AppError(
        HttpStatus.CONFLICT,
        AuthResponseCode.EMAIL_EXIST,
        "Email đã được sử dụng",
        true,
      );
    // Create new account
    const hashedPassword = await hashString(password);
    const newAccount = await accountRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      provider: "local",
      role: Role.USER,
    });
    // Revoke OTP
    await otpService.revokeOtp({
      target: email,
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.VERIFY_EMAIL_REGISTER,
    });
    return newAccount;
  };

  public logout = async (res: Response) => {
    const { sessionId } = res.locals.auth as RefreshTokenPayload;
    // Delete session from database
    await sessionRepository.deleteById(sessionId);
    // Delete session from redis
    await redisService.deleteKey(redisKeys.session(sessionId));
    // Clear cookie token
    this.clearCookieToken(res);
  };

  public refresh = async (req: Request, res: Response) => {
    // Get token from cookie
    const token = req.cookies[JWTConfig.JWT_REFRESH_COOKIE_NAME];
    // No token found
    if (!token)
      throw new JWTError(JWTResponseCode.TOKEN_MISSING, "Không tìm thấy token");
    // Verify token
    const tokenPayload = jwtService.verifyRefreshToken(token);
    // Find session in redis and database
    const session = await sessionService.getOrLoadSession(
      tokenPayload.sessionId,
      tokenPayload.role,
    );
    // Session not found
    if (!session) {
      throw new JWTError(
        JWTResponseCode.TOKEN_REVOKED,
        "Không tìm thấy phiên làm việc",
      );
    }
    // JTI mismatch
    if (session.jti !== tokenPayload.jti) {
      // Handle use revoked token logic here
      throw new JWTError(JWTResponseCode.TOKEN_REVOKED, "Token đã bị thu hồi");
    }
    // Create new tokens and refresh expiredAt
    const refreshJti = nanoid();
    const { token: refreshToken, expiresAt: refreshExpiresAt } =
      jwtService.createRefreshToken({
        sub: session.sub,
        role: session.role,
        jti: refreshJti,
        sessionId: session.sessionId,
        version: session.version + 1,
      });
    const { token: accessToken } = jwtService.createAccessToken({
      sub: session.sub,
      role: session.role,
      sessionId: session.sessionId,
      sessionVersion: session.version + 1,
    });
    await sessionService.updateSessionAndSync({
      sessionId: session.sessionId,
      version: session.version + 1,
      role: session.role,
      rtJti: refreshJti,
      expiresAt: new Date(refreshExpiresAt),
    });
    // Reset cookie token
    this.createCookieToken(res, refreshToken, tokenPayload.role);
    return { accessToken };
  };

  public async sendUserRegisterOtp(
    email: string,
  ): Promise<{ expiresAt: Date }> {
    const policy = otpPolicies.VERIFY_EMAIL_REGISTER;
    const existAccount = await accountRepository.findByEmail(email);
    // Send OTP If email not used
    if (!existAccount) {
      const expiresAt = await otpService.sendOtp({
        target: email,
        channel: OtpChannel.EMAIL,
        purpose: OtpPurpose.VERIFY_EMAIL_CHANGE_EMAIL,
      });
      return { expiresAt };
    }
    // If email is used -> only send expire time
    const expiresAt = new Date(Date.now() + policy.ttlSecs * 1000);
    return { expiresAt };
  }

  public async forgotPassword(email: string) {
    // Check if account exists
    const account = await accountRepository.findByEmail(email, Role.USER);
    if (!account) {
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    const config = {
      resetLink: `${env.APP_BASE_URL}/reset-password?token=${token}&email=${email}`,
      appName: env.APP_NAME,
      expiredInSeconds: 15 * 60,
    };
    // Save token to redis
    await redisService.setValue(
      redisKeys.passwordReset(email),
      await hashString(token),
      config.expiredInSeconds,
    );
    // Send email
    const html = generateResetPasswordHtml(config);
    await mailService.send({
      to: email,
      subject: `${env.APP_NAME} - Đặt lại mật khẩu`,
      html,
    });
  }

  public async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ) {
    // Verify token
    const savedHashedToken = await redisService.getValue<string>(
      redisKeys.passwordReset(email),
    );
    if (!savedHashedToken || !(await compareString(token, savedHashedToken))) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        AuthResponseCode.INVALID_RESET_TOKEN,
        "Token không hợp lệ",
        true,
      );
    }
    // Update new password
    const hashedPassword = await hashString(newPassword);
    const account = await accountRepository.findByEmail(email, Role.USER);
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AuthResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
        true,
      );
    }

    await accountRepository.changePassword(
      account.id,
      account.user!.id,
      hashedPassword,
    );
  }
}

export default new AuthService();
