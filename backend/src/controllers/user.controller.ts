import { Request, Response } from "express";
import { UpdateUserIType, updateUserSchema } from "../schemas/user.schema";
import { TokenPayload } from "../types/token-payload";
import userRepository from "../repositories/user.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { UserResponseCode } from "../constants/codes/user.code";
import { getFileName, handleImagesUpload, validateFile } from "../utils/file";
import storage from "../storage";
import { AccessTokenPayload } from "../services/jwt.service";

class UserController {
  // public updateUser = async (
  //   req: Request<any, any, UpdateUserIType["body"]>,
  //   res: Response
  // ) => {
  //   try {
  //     const { sub } = res.locals.auth as AccessTokenPayload;
  //     const { name } = req.body;
  //     const user = await userRepository.updateName(sub, name);
  //     res
  //       .status(HttpStatus.OK)
  //       .json(
  //         successResponse(UserResponseCode.OK, "Cập nhật tên thành công", user)
  //       );
  //   } catch (e) {
  //     throw e;
  //   }
  // };

  // public changeAvatar = async (req: Request, res: Response) => {
  //   const avatarFile = req.file as Express.Multer.File;

  //   // Kiểm tra file - ko hợp lệ -> throw error
  //   validateFile(avatarFile, {
  //     inputField: "avatar",
  //     maxSize: 1 * 1024 * 1024,
  //     type: "image",
  //   });
  //   // Hợp lệ
  //   // Lưu file mới
  //   const url = await storage.save(
  //     avatarFile.buffer,
  //     String(Date.now()),
  //     avatarFile.mimetype
  //   );
  //   const { sub } = res.locals.auth as AccessTokenPayload;
  //   // Xóa file cũ
  //   const user = await userRepository.findById(sub);
  //   if (user && user.avatarUrl) {
  //     await storage.delete(user.avatarUrl);
  //   }
  //   // Cập nhật đường dẫn mới
  //   await userRepository.updateAvatar(sub, url);

  //   res.status(HttpStatus.OK).json(
  //     successResponse(UserResponseCode.OK, "Tạo avatar thành công", {
  //       avatarUrl: url,
  //     })
  //   );
  // };

  public update = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { name, phone },
    } = updateUserSchema.parse(req);
    const user = await userRepository.findById(sub);
    if (!user) {
      throw new Error("User not found");
    }
    const avatarFile = req.file as Express.Multer.File;
    let newAvatarUrl: string | undefined;
    if (avatarFile) {
      handleImagesUpload({
        files: [avatarFile],
        fn: async (newUrls) => {
          newAvatarUrl = newUrls[0];
        },
        oldUrls: user.avatarUrl ? [user.avatarUrl] : [],
        options: {
          inputField: "avatar",
          maxSize: 512 * 1024,
        },
      });
    }

    const {
      createdAt,
      creatorId,
      modifierId,
      version,
      updatedAt,
      accountId,
      ...restUser
    } = await userRepository.update(sub, {
      name,
      phone,
      avatarUrl: newAvatarUrl,
      modifierId: sub,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          UserResponseCode.OK,
          "Cập nhật thông tin thành công",
          restUser
        )
      );
  };
}

export default new UserController();
