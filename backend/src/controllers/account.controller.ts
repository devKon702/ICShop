import { Request, Response } from "express";
import accountRepository from "../repositories/account.repository";
import { TokenPayload } from "../types/token-payload";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { successResponse } from "../utils/response";
import {
  ChangePasswordIType,
  filterAccountSchema,
  getAccountInfoSchema,
  changeAccountStatusSchema,
} from "../schemas/account.schema";
import { UserResponseCode } from "../constants/codes/user.code";
import { AccountResponseCode } from "../constants/codes/account.code";
import { compareString, hashString } from "../utils/bcrypt";
import { Role } from "../constants/db";
import { http } from "winston";
import { sanitizeData } from "../utils/sanitize";

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
        true
      );
    }
    const { password, ...accountWithoutPassword } = account;
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AccountResponseCode.OK,
          "Tìm thông tin thành công",
          accountWithoutPassword
        )
      );
  };

  public getMyInformation = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const account = await accountRepository.findByUserId(sub);
    if (!account)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy thông tin",
        true
      );
    const { password, ...accountWithoutPass } = account;
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          AuthResponseCode.OK,
          "Lấy thông tin thành công",
          accountWithoutPass
        )
      );
  };

  public changePassword = async (
    req: Request<any, any, ChangePasswordIType["body"]>,
    res: Response
  ) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const { oldPassword, newPassword } = req.body;
    // Tìm tài khoản
    const account = await accountRepository.findByUserId(sub);
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        UserResponseCode.NOT_FOUND,
        "Không tìm thấy người dùng",
        true
      );
    }
    // Kiểm tra tài khoản bị khóa
    if (!account.isActive) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AccountResponseCode.LOCKED,
        "Tài khoản đang bị khóa",
        true
      );
    }
    // So sánh mật khẩu cũ
    if (
      !account.password ||
      !(await compareString(oldPassword, account.password))
    ) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        AccountResponseCode.WRONG_PASSWORD,
        "Không đúng mật khẩu",
        true
      );
    }
    // Thay đổi mật khẩu
    accountRepository.changePassword(
      account.id,
      account.user?.id!,
      await hashString(newPassword)
    );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(AccountResponseCode.OK, "Thay đổi mật khẩu thành công")
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
        { total: count, page, limit }
      )
    );
  };

  public changeStatus = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { accountId, isActive },
    } = changeAccountStatusSchema.parse(req);

    // Kiểm tra tự khóa bản thân
    if (sub === accountId)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        AccountResponseCode.SELF_LOCK,
        "Không thể thao tác trên tài khoản bản thân",
        true
      );
    // Tìm kiếm tài khoản
    const account = await accountRepository.findById(accountId);
    if (!account) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        AccountResponseCode.NOT_FOUND,
        "Không tìm thấy tài khoản",
        true
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
        })
      )
    );
    return;
  };
}

export default new AccountController();
