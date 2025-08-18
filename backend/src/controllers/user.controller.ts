import { Request, Response } from "express";
import { UpdateUserIType } from "../schemas/user.schema";
import { JwtPayload } from "../types/jwt-payload";
import userRepository from "../repositories/user.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { UserResponseCode } from "../constants/codes/user.code";

class UserController {
  public updateUser = async (
    req: Request<any, any, UpdateUserIType["body"]>,
    res: Response
  ) => {
    try {
      const { sub: userId } = res.locals.tokenPayload as JwtPayload;
      const { name } = req.body;
      const user = await userRepository.updateName(userId, name);
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(UserResponseCode.OK, "Cập nhật tên thành công", user)
        );
    } catch (e) {
      throw e;
    }
  };

  public changeAvatar = async (req: Request, res: Response) => {};
}

export default new UserController();
