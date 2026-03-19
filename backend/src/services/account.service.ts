import { AccountResponseCode } from "../constants/codes/account.code";
import { SecurityResponseCode } from "../constants/codes/security.code";
import { Role } from "../constants/db";
import { env } from "../constants/env";
import { HttpStatus } from "../constants/http-status";
import { AppError } from "../errors/app.error";
import { NotFoundError } from "../errors/not-found.error";
import accountRepository from "../repositories/account.repository";
import { compareString, hashString } from "../utils/bcrypt.util";
import {
  generateAdminChangeEmailRequest,
  generateAdminConfirmChangePassword,
  generateAdminLockAccount,
} from "../utils/html.util";
import mailService from "./mail.service";
import { OtpChannel, OtpPurpose, otpService } from "./otp";
import { SecurityAction } from "./security";
import securityTokenService from "./security/security-token.service";

class AccountService {
  public async adminRequestChangeEmail(data: {
    password: string;
    account: { password: string; email: string; userId: number };
  }) {
    // Check password
    if (!(await compareString(data.password, data.account.password))) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.WRONG_PASSWORD,
        "Mật khẩu không chính xác",
        true,
      );
    }

    // Send link to email
    const ttlSeconds = 30 * 60;
    const { token: confirmToken } = await securityTokenService.create(
      {
        action: SecurityAction.CONFIRM_CHANGE_EMAIL,
        metadata: { email: data.account.email },
      },
      ttlSeconds,
    );
    const { token: lockToken } = await securityTokenService.create(
      {
        action: SecurityAction.LOCK_ACCOUNT,
        metadata: {
          userId: data.account.userId,
        },
      },
      ttlSeconds,
    );
    const confirmLink = `${env.ADMIN_BASE_URL}/change-email?token=${confirmToken}&expiresAt=${new Date(Date.now() + ttlSeconds * 1000).toISOString()}`;
    const lockLink = `${env.ADMIN_BASE_URL}/lock-account?token=${lockToken}&expiresAt=${new Date(Date.now() + ttlSeconds * 1000).toISOString()}`;

    await mailService.send({
      to: data.account.email,
      subject: `${env.APP_NAME} - Cập nhật email`,
      html: generateAdminChangeEmailRequest({
        appName: env.APP_NAME,
        confirmLink,
        lockLink: lockLink,
        expiresInMins: Math.round(ttlSeconds / 60),
      }),
    });
  }

  public async adminRejectChangeEmail(rejectToken: string) {
    // Veiry reject token from user
    const rejectPayload = await securityTokenService.verify(
      rejectToken,
      SecurityAction.REJECT_CHANGE_EMAIL,
    );
    if (!rejectPayload) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        SecurityResponseCode.INVALID_TOKEN,
        "Token không hợp lệ",
        true,
      );
    }
    // Revoken reject and confirm token (saved in payload of reject token)
    const confirmToken = rejectPayload.metadata.token;
    if (!confirmToken)
      throw new Error("Cannot find token in security payload from redis");
    // Revoke both confirm and reject token
    await Promise.all([
      securityTokenService.revoke(confirmToken),
      securityTokenService.revoke(rejectToken),
    ]);
  }

  public async adminConfirmChangeEmail(input: {
    confirmToken: string;
    newEmail: string;
    otp: string;
  }) {
    // Verify confirm token from user
    const confirmPayload = await securityTokenService.verify(
      input.confirmToken,
      SecurityAction.CONFIRM_CHANGE_EMAIL,
    );
    if (!confirmPayload) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        SecurityResponseCode.INVALID_TOKEN,
        "Token không hợp lệ",
        true,
      );
    }
    const oldEmail = confirmPayload.metadata.email;
    if (!oldEmail)
      throw new Error("Cannot find email in security payload from redis");
    // Get and check account
    const account = await accountRepository.findByEmail(oldEmail, Role.ADMIN);
    if (!account) {
      throw new NotFoundError(
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
      );
    }
    // Check if account is locked
    if (account.isActive) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AccountResponseCode.LOCKED,
        "Tài khoản đã bị khóa",
        true,
      );
    }
    // Check if new email is used
    const emailExisted = !!(await accountRepository.findByEmail(
      input.newEmail,
    ));
    if (emailExisted) {
      throw new AppError(
        HttpStatus.CONFLICT,
        AccountResponseCode.EMAIL_EXISTS,
        "Email đã được sử dụng",
        true,
      );
    }
    // Check if OTP (for verifying new email) is valid
    const savePayload = await otpService.verifyOtp({
      target: input.newEmail,
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.VERIFY_EMAIL_ADMIN_CHANGE_EMAIL,
      code: input.otp,
    });
    if (!savePayload) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.INVALID_OTP,
        "OTP không hợp lệ",
        true,
      );
    }
    // Update email
    await accountRepository.update(account.id, account.user!.id, {
      email: input.newEmail,
    });
    // Revoke confirm token and OTP
    const revokeResults = await Promise.allSettled([
      securityTokenService.revoke(input.confirmToken),
      otpService.revokeOtp({
        target: input.newEmail,
        channel: OtpChannel.EMAIL,
        purpose: OtpPurpose.VERIFY_EMAIL_ADMIN_CHANGE_EMAIL,
      }),
    ]);
    // Log out error if some fail
    revokeResults.forEach((item) => {
      if (item.status === "rejected")
        console.error("Revoke error: " + item.reason);
    });
    // Send notification email and lock-account form to old email
    const lockTokenExpiresInHours = 6;
    const { token, expiresAt } = await securityTokenService.create(
      {
        action: SecurityAction.LOCK_ACCOUNT,
        metadata: {
          userId: account.user!.id,
        },
      },
      lockTokenExpiresInHours * 60 * 60,
    );
    const lockLink = `${env.ADMIN_BASE_URL}/lock-account?token=${token}&expiresAt=${expiresAt.toISOString()}`;
    await mailService.send({
      to: oldEmail,
      subject: `${env.APP_NAME} - Thông báo email thay đổi`,
      html: generateAdminLockAccount({
        appName: env.APP_NAME,
        expiresInHours: lockTokenExpiresInHours,
        link: lockLink,
      }),
    });
  }

  public async adminSendOtp2ChangeEmail(email: string) {
    const account = await accountRepository.findByEmail(email);
    if (account) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        AccountResponseCode.EMAIL_EXISTS,
        "Email đã được sử dụng",
        true,
      );
    }

    await otpService.sendOtp({
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.VERIFY_EMAIL_ADMIN_CHANGE_EMAIL,
      target: email,
    });
  }

  public async adminLockAccount(token: string) {
    const lockPayload = await securityTokenService.verify(
      token,
      SecurityAction.LOCK_ACCOUNT,
    );
    if (!lockPayload) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        SecurityResponseCode.INVALID_TOKEN,
        "Token không hợp lệ",
        true,
      );
    }
    const userId = lockPayload.metadata.userId;
    if (!userId) {
      throw new Error("The expected userId is missing from the metadata");
    }
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      throw new Error(
        `The exprected account by userId ${userId} was not found`,
      );
    }
    await accountRepository.update(account.id, account.user!.id, {
      isActive: false,
    });
  }

  public async adminRequestChangePassword(input: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  }) {
    const ttlMinutes = 180;
    // Get account
    const account = await accountRepository.findByUserId(input.userId);
    if (!account)
      throw new NotFoundError(
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
      );
    // Check password
    if (
      !account.password ||
      !compareString(input.oldPassword, account.password)
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.WRONG_PASSWORD,
        "Mật khẩu hiện tại không đúng",
        true,
      );
    }
    // Create confirm and lock token
    const { token: confirmToken, expiresAt: confirmExpiresAt } =
      await securityTokenService.create(
        {
          action: SecurityAction.ADMIN_CHANGE_PASSWORD,
          metadata: {
            userId: input.userId,
            hashedPassword: await hashString(input.newPassword),
          },
        },
        ttlMinutes * 60,
      );
    const { token: lockToken, expiresAt: lockExpiresAt } =
      await securityTokenService.create(
        {
          action: SecurityAction.LOCK_ACCOUNT,
          metadata: {
            userId: input.userId,
          },
        },
        ttlMinutes * 60,
      );
    // Create magic links and send to email
    const confirmLink = `${env.ADMIN_BASE_URL}/change-password?token=${confirmToken}&expiresAt=${confirmExpiresAt.toISOString()}`;
    const lockLink = `${env.ADMIN_BASE_URL}/change-password?token=${lockToken}&expiresAt=${lockExpiresAt.toISOString()}`;
    await mailService.send({
      to: account.email,
      subject: `${env.APP_NAME} - Thay đổi mật khẩu`,
      html: generateAdminConfirmChangePassword({
        appName: env.APP_NAME,
        confirmLink,
        lockLink,
        expireMinutes: Math.round(ttlMinutes),
      }),
    });
  }

  public async adminConfirmChangePassword(token: string) {
    const confirmPayload = await securityTokenService.verify(
      token,
      SecurityAction.ADMIN_CHANGE_PASSWORD,
    );
    if (!confirmPayload) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        SecurityResponseCode.INVALID_TOKEN,
        "Token không hợp lệ",
        true,
      );
    }
    // userId and password should be provided when request
    const { userId, hashedPassword: hashedPassword } = confirmPayload.metadata;
    if (!userId) {
      throw new Error("Expected userId missing from payload");
    }
    if (!hashedPassword) {
      throw new Error("Expected password missing from payload");
    }

    // Update password
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundError(AccountResponseCode.NOT_FOUND);
    }
    await accountRepository.update(account.id, userId, {
      password: hashedPassword,
    });

    // Revoken confirm token
    await securityTokenService.revoke(token);
  }
}

export default new AccountService();
