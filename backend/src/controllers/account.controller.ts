import { Request, Response } from "express";
import accountRepository from "../repositories/account.repository";
import { TypedRequest } from "../types/TypedRequest";
import { ResponseObject, StatusCode } from "../models/response";
import { TokenPayload } from "../types/token-payload";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { AuthResponseCode } from "../constants/codes/auth.code";
import { successResponse } from "../utils/response";

class AccountController {
  public getAccountInformation = async (
    req: TypedRequest<{ id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    try {
      const account = await accountRepository.findById(Number(id));
      if (!account) {
        res.json(new ResponseObject(404, "Not found", null));
        return;
      }
      const { password, ...accountWithoutPassword } = account;
      res.json(new ResponseObject(200, "success", accountWithoutPassword));
    } catch {
      res
        .status(400)
        .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
    }
  };

  public getMyInformation = async (req: Request, res: Response) => {
    try {
      const { sub } = res.locals.tokenPayload as TokenPayload;
      const user = await accountRepository.findByUserId(sub);
      if (!user)
        throw new AppError(
          HttpStatus.NOT_FOUND,
          AuthResponseCode.NOT_FOUND,
          "Không tìm thấy thông tin",
          true
        );
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(AuthResponseCode.OK, "Lấy thông tin thành công", user)
        );
    } catch (err) {
      throw err;
    }
  };
}

export default new AccountController();
