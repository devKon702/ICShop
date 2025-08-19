import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateUserSchema } from "../schemas/user.schema";
import { singleUpload } from "../utils/multer";

const userRouter = express.Router();

const path = "/user";

userRouter.patch(
  path,
  verifyAccessToken,
  validate(updateUserSchema),
  userController.updateUser
);

userRouter.patch(
  path + "/upload-avatar",
  verifyAccessToken,
  singleUpload("avatar"),
  userController.changeAvatar
);

export default userRouter;
