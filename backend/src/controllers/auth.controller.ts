import { Request, Response } from "express";
import accountRepository from "../repositories/account.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { LoginType, SignupType } from "../schemas/auth.schema";
import { AppError } from "../utils/app-error";
import { createAccessToken } from "../utils/jwt";
import { comparePassword } from "../utils/bcrypt";

class AuthController {
  login = async (req: Request<any, any, LoginType["body"]>, res: Response) => {
    try {
      const { email, password } = req.body;
      const account = await accountRepository.findByEmail(email);
      // Không tìm thấy
      if (!account) {
        // res
        //   .status(HttpStatus.NOT_FOUND)
        //   .json(
        //     failResponse(AuthResponseCode.NOT_FOUND, "Không tìm thấy tài khoản")
        //   );
        throw new AppError(
          HttpStatus.NOT_FOUND,
          AuthResponseCode.NOT_FOUND,
          "Không tìm thấy tài khoản",
          true
        );
      }
      // Sai mật khẩu, bao gồm trường hợp password null với google signup
      if (
        !account.password ||
        !(await comparePassword(password, account.password))
      ) {
        // res
        //   .status(HttpStatus.UNAUTHORIZED)
        //   .json(failResponse(AuthResponseCode.WRONG_PASSWORD, "Sai mật khẩu"));
        // return;
        throw new AppError(
          HttpStatus.UNAUTHORIZED,
          AuthResponseCode.WRONG_PASSWORD,
          "Sai mật khẩu",
          true
        );
      }
      // Tài khoản bị khoá
      else if (!account.isActive)
        // res.json(
        //   new ResponseObject(StatusCode.UNAUTHORIZED, "Account blocked", null)
        // );
        throw new AppError(
          HttpStatus.FORBIDDEN,
          AuthResponseCode.USER_BLOCKED,
          "Tài khoản đã bị khóa",
          true
        );
      // Thành công
      else {
        const { password, ...accountWithoutPassword } = account;
        const token = createAccessToken({
          sub: account.user!.id,
          role: account.role,
        });
        res.status(HttpStatus.OK).json(
          successResponse(AuthResponseCode.OK, "Đăng nhập thành công", {
            account: accountWithoutPassword,
            token,
          })
        );
      }
    } catch (err) {
      throw err;
    }
  };

  signup = async (
    req: Request<any, any, SignupType["body"]>,
    res: Response
  ) => {};

  test(req: Request, res: Response) {
    const payload = res.locals.payload;
    res
      .status(HttpStatus.OK)
      .json(successResponse(AuthResponseCode.OK, "Test auth success", payload));
  }
}
export default new AuthController();
