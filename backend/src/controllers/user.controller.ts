import { Request, Response } from "express";
import { updateUserSchema } from "../schemas/user.schema";
import userRepository from "../repositories/user.repository";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response.util";
import { UserResponseCode } from "../constants/codes/user.code";
import { handleImagesUpload } from "../utils/file.util";
import { AccessTokenPayloadSchema } from "../schemas/jwt.schema";

class UserController {
  public update = async (req: Request, res: Response) => {
    const { sub } = AccessTokenPayloadSchema.parse(res.locals.auth);
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
          restUser,
        ),
      );
  };
}

export default new UserController();
