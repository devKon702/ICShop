import { Request, Response } from "express";
import accountRepository from "../repositories/account.repository";
import { AppError } from "../errors/app.error";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { successResponse } from "../utils/response.util";
import {
  ChangePasswordIType,
  filterAccountSchema,
  getAccountInfoSchema,
  changeAccountStatusSchema,
  updateUserEmailSchema,
  sendUpdateUserEmailOtpSchema,
  adminRequestChangeEmailSchema,
  adminRejectChangeEmailSchema,
  adminConfirmChangeEmailSchema,
  adminLockAccountSchema,
  adminRequestChangePasswordSchema,
  adminConfirmChangePasswordSchema,
} from "../schemas/account.schema";
import { AccountResponseCode } from "../constants/codes/account.code";
import { compareString, hashString } from "../utils/bcrypt.util";
import { sanitizeData } from "../utils/sanitize.util";
import { NotFoundError } from "../errors/not-found.error";
import { AccessTokenPayload } from "../services/jwt.service";
import {
  OtpChannel,
  otpPolicies,
  OtpPurpose,
  otpService,
} from "../services/otp";
import { Role } from "../constants/db";
import accountService from "../services/account.service";
import { maskEmail } from "../utils/string.util";

class AccountController {
  public getInfo = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getAccountInfoSchema.parse(req);
    const account = await accountRepository.findById(id);
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
        true,
      );
    }
    const { password, ...accountWithoutPassword } = account;
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AccountResponseCode.OK,
          "Tìm thông tin thành công",
          accountWithoutPassword,
        ),
      );
  };

  public getMyInformation = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const account = await accountRepository.findByUserId(sub);
    if (!account)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy thông tin",
        true,
      );
    const { password, ...accountWithoutPass } = account;
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AuthResponseCode.OK,
          "Lấy thông tin thành công",
          accountWithoutPass,
        ),
      );
  };

  public changePassword = async (
    req: Request<any, any, ChangePasswordIType["body"]>,
    res: Response,
  ) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const { currentPassword, newPassword } = req.body;
    // Check account existence
    const account = await accountRepository.findByUserId(sub);
    if (!account) {
      throw new NotFoundError(
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
      );
    }
    // Kiểm tra tài khoản bị khóa
    if (!account.isActive) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AccountResponseCode.LOCKED,
        "Tài khoản đang bị khóa",
        true,
      );
    }
    // Check if account is local account
    if (account.provider !== "local") {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.WRONG_PASSWORD,
        "Tài khoản tạo với Google không thể đổi mật khẩu",
        true,
      );
    }
    // So sánh mật khẩu cũ
    if (
      !account.password ||
      !(await compareString(currentPassword, account.password))
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.WRONG_PASSWORD,
        "Mật khẩu hiện tại không đúng",
        true,
      );
    }
    // Thay đổi mật khẩu
    accountRepository.changePassword(
      account.id,
      account.user?.id!,
      await hashString(newPassword),
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AccountResponseCode.OK, "Thay đổi mật khẩu thành công"),
      );
  };

  public filter = async (req: Request, res: Response) => {
    const {
      query: { email, name, phone, limit, page, role, sortBy },
    } = filterAccountSchema.parse(req);

    const [accounts, count] = await accountRepository.filter({
      email,
      name,
      phone,
      role,
      page,
      limit,
      sortBy,
    });
    res.status(HttpStatus.OK).json(
      successResponse(
        AccountResponseCode.OK,
        "Lọc tài khoản thành công",
        sanitizeData(accounts, {
          useDefault: false,
          omit: ["password"],
        }),
        { total: count, page, limit },
      ),
    );
  };

  public changeStatus = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { accountId, isActive },
    } = changeAccountStatusSchema.parse(req);

    // Kiểm tra tự khóa bản thân
    if (sub === accountId)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AccountResponseCode.SELF_LOCK,
        "Không thể thao tác trên tài khoản bản thân",
        true,
      );
    // Tìm kiếm tài khoản
    const account = await accountRepository.findById(accountId);
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
        true,
      );
    }
    // Kiểm tra có cần đổi isActive không
    const result =
      account.isActive === isActive
        ? account
        : await accountRepository.changeStatus(accountId, isActive, sub);

    res.status(HttpStatus.OK).json(
      successResponse(
        AccountResponseCode.OK,
        isActive ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công",
        sanitizeData(result, {
          useDefault: false,
          omit: ["password"],
        }),
      ),
    );
    return;
  };

  public sendUpdateUserEmailOtp = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { email },
    } = sendUpdateUserEmailOtpSchema.parse(req);
    const policy = otpPolicies.CHANGE_EMAIL;
    const account = await accountRepository.findByEmail(email);
    const expiresAt = !account
      ? await otpService.sendOtp({
          target: email,
          channel: OtpChannel.EMAIL,
          purpose: OtpPurpose.CHANGE_EMAIL,
        })
      : new Date(Date.now() + policy.ttlSecs * 1000);
    res.status(HttpStatus.OK).json(
      successResponse(AccountResponseCode.OK, "Gửi OTP thành công", {
        expiresAt,
      }),
    );
  };

  public updateUserEmail = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { email, otp },
    } = updateUserEmailSchema.parse(req);
    const account = await accountRepository.findByUserId(sub);
    if (!account) {
      throw new NotFoundError(
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
      );
    }
    if (account.isActive === false) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AccountResponseCode.LOCKED,
        "Tài khoản đang bị khóa",
        true,
      );
    }
    // Check OTP
    if (
      !(await otpService.verifyOtp({
        target: email,
        channel: OtpChannel.EMAIL,
        purpose: OtpPurpose.CHANGE_EMAIL,
        code: otp,
      }))
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.INVALID_OTP,
        "Mã OTP không hợp lệ",
        true,
      );
    }
    // Check unique email including this account
    const existingAccountByEmail = await accountRepository.findByEmail(email);
    if (existingAccountByEmail) {
      throw new AppError(
        HttpStatus.CONFLICT,
        AccountResponseCode.EMAIL_EXISTS,
        "Email đã được sử dụng",
        true,
      );
    }
    // Update email
    const result = await accountRepository.update(account.id, sub, { email });
    // Revoke OTP
    await otpService.revokeOtp({
      target: email,
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.CHANGE_EMAIL,
    });

    res.status(HttpStatus.OK).json(
      successResponse(AccountResponseCode.OK, "Cập nhật email thành công", {
        email: result.email,
      }),
    );
  };

  public adminRequestChangeEmail = async (req: Request, res: Response) => {
    const {
      body: { password },
    } = adminRequestChangeEmailSchema.parse(req);
    const { sub } = res.locals.auth as AccessTokenPayload;
    const account = await accountRepository.findByUserIdAndRole(
      sub,
      Role.ADMIN,
    );
    // For sure, account must be exists and available due to access token verify
    if (!account)
      throw new Error(
        "Unexpected error: Valid JWT provided but account does not exist in the database.",
      );
    await accountService.adminRequestChangeEmail({
      password,
      account: { password: account.password!, email: account.email },
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AccountResponseCode.OK,
          `Đã gửi yêu cầu cập nhật đến ${maskEmail(account.email)}`,
        ),
      );
  };

  public adminRejectChangeEmail = async (req: Request, res: Response) => {
    const {
      body: { token },
    } = adminRejectChangeEmailSchema.parse(req);
    await accountService.adminRejectChangeEmail(token);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AccountResponseCode.OK,
          "Từ chối yêu cầu cập nhật email thành công",
        ),
      );
  };

  public adminConfirmChangeEmail = async (req: Request, res: Response) => {
    const {
      body: { token, newEmail, otp },
    } = adminConfirmChangeEmailSchema.parse(req);
    await accountService.adminConfirmChangeEmail({
      confirmToken: token,
      newEmail,
      otp,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AccountResponseCode.OK, "Cập nhật email thành công"),
      );
  };

  public adminLockAccount = async (req: Request, res: Response) => {
    const {
      body: { token },
    } = adminLockAccountSchema.parse(req);
    await accountService.adminLockAccount(token);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AccountResponseCode.OK, "Đã khóa tài khoản thành công"),
      );
  };

  public adminRequestChangePassword = async (req: Request, res: Response) => {
    const {
      body: { newPassword, oldPassword },
    } = adminRequestChangePasswordSchema.parse(req);
    const { sub } = res.locals.auth as AccessTokenPayload;
    await accountService.adminRequestChangePassword({
      oldPassword,
      newPassword,
      userId: sub,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AccountResponseCode.OK,
          "Thư xác thực được gửi đến email của bạn",
        ),
      );
  };
  public adminConfirmChangePassword = async (req: Request, res: Response) => {
    const {
      body: { token },
    } = adminConfirmChangePasswordSchema.parse(req);
    await accountService.adminConfirmChangePassword(token);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AccountResponseCode.OK, "Cập nhật mật khẩu thành công"),
      );
  };
}

export default new AccountController();
