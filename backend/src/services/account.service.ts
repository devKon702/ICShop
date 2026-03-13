import { AccountResponseCode } from "../constants/codes/account.code";
import { SecurityResponseCode } from "../constants/codes/security.code";
import { Role } from "../constants/db";
import { env } from "../constants/env";
import { HttpStatus } from "../constants/http-status";
import { AppError } from "../errors/app.error";
import { NotFoundError } from "../errors/not-found.error";
import accountRepository from "../repositories/account.repository";
import { compareString } from "../utils/bcrypt.util";
import {
  generateAdminChangeEmailRequest,
  generateAdminLockAccount,
} from "../utils/html.util";
import mailService from "./mail.service";
import { OtpChannel, OtpPurpose, otpService } from "./otp";
import { SecurityAction } from "./security";
import securityTokenService from "./security/security-token.service";

class AccountService {
  public async adminRequestChangeEmail(data: {
    password: string;
    account: { password: string; email: string };
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
    const { token: rejectToken } = await securityTokenService.create(
      {
        action: SecurityAction.REJECT_CHANGE_EMAIL,
        metadata: {
          token: confirmToken,
        },
      },
      ttlSeconds,
    );
    const confirmLink = `${env.APP_NAME}/admin/change-email/confirm?token=${confirmToken}&expiresAt=${new Date(Date.now() + ttlSeconds * 1000)}`;
    const rejectLink = `${env.APP_NAME}/admin/change-email/reject?token=${rejectToken}&expiresAt=${new Date(Date.now() + ttlSeconds * 1000)}`;

    await mailService.send({
      to: data.account.email,
      subject: `${env.APP_NAME} - Cập nhật email`,
      html: generateAdminChangeEmailRequest({
        appName: env.APP_NAME,
        confirmLink,
        rejectLink,
        expiresInMins: Math.round(ttlSeconds / 60),
      }),
    });
  }

  public async adminRejectChangeEmail(rejectToken: string) {
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
    // Check if email is used
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
    // Check if OTP is valid
    const emailValid = await otpService.verifyOtp({
      target: input.newEmail,
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.ADMIN_CHANGE_EMAIL,
      code: input.otp,
    });
    if (!emailValid) {
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
    // Revoke OTP
    await otpService.revokeOtp({
      target: input.newEmail,
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.ADMIN_CHANGE_EMAIL,
    });
    // Send notification email and lock account form to old email
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
    const lockLink = `${env.APP_BASE_URL}/admin/account/lock?token=${token}&expiresAt=${expiresAt}`;
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
}

export default new AccountService();
