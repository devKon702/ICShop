import { Request, Response } from "express";
import { UpdateUserIType } from "../schemas/user.schema";
import { TokenPayload } from "../types/token-payload";
import userRepository from "../repositories/user.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { UserResponseCode } from "../constants/codes/user.code";
import { getFileName, validateFile } from "../utils/file";
import storage from "../storage";

class UserController {
  public updateUser = async (
    req: Request<any, any, UpdateUserIType["body"]>,
    res: Response
  ) => {
    try {
      const { sub } = res.locals.tokenPayload as TokenPayload;
      const { name } = req.body;
      const user = await userRepository.updateName(sub, name);
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(UserResponseCode.OK, "Cập nhật tên thành công", user)
        );
    } catch (e) {
      throw e;
    }
  };

  public changeAvatar = async (req: Request, res: Response) => {
    try {
      const avatarFile = req.file as Express.Multer.File;

      // Kiểm tra file - ko hợp lệ -> throw error
      validateFile(avatarFile, {
        inputField: "avatar",
        maxSize: 1 * 1024 * 1024,
        type: "image",
      });
      // Hợp lệ
      // Lưu file mới
      const url = await storage.save(
        avatarFile.buffer,
        String(Date.now()),
        avatarFile.mimetype
      );
      const { sub } = res.locals.tokenPayload as TokenPayload;
      // Xóa file cũ
      const user = await userRepository.findById(sub);
      if (user && user.avatarUrl) {
        await storage.delete(user.avatarUrl);
      }
      // Cập nhật đường dẫn mới
      await userRepository.updateAvatar(sub, url);

      res.status(HttpStatus.OK).json(
        successResponse(UserResponseCode.OK, "Tạo avatar thành công", {
          avatarUrl: url,
        })
      );
      return;
    } catch (err) {
      throw err;
    }
  };
}

export default new UserController();
