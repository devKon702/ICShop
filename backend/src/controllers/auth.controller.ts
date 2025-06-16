import { Request, Response } from "express";
import { ResponseObject, StatusCode } from "../models/response";
import accountRepository from "../repositories/account.repository";
import { TypedRequest } from "../types/TypedRequest";

const login = async (
  req: TypedRequest<any, { email: string; password: string }>,
  res: Response
) => {
  try {
    const account = await accountRepository.findByEmail(req.body.email);
    // Không tìm thấy
    if (!account) {
      res.json(new ResponseObject(StatusCode.NOT_FOUND, "Not found", null));
      return;
    }
    // Đăng nhập thường với tài khoản đăng nhập bằng google
    if (account.isGoogleAuth)
      res.json(
        new ResponseObject(
          StatusCode.UNAUTHORIZED,
          "Google authen account",
          null
        )
      );
    // Sai mật khẩu
    else if (account.password !== req.body.password)
      res.json(
        new ResponseObject(StatusCode.UNAUTHORIZED, "Wrong password", null)
      );
    // Tài khoản bị khoá
    else if (!account.isActive)
      res.json(
        new ResponseObject(StatusCode.UNAUTHORIZED, "Account blocked", null)
      );
    // Thành công
    else {
      const { password, ...accountWithoutPassword } = account;
      res.json(
        new ResponseObject(StatusCode.OK, "success", accountWithoutPassword)
      );
    }
  } catch {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

const register = async (req: Request, res: Response) => {};

export default { login, register };
