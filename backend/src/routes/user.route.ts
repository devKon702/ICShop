import express from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { updateUserSchema } from "../schemas/user.schema";
import { upload } from "../utils/multer";

const userRouter = express.Router();

const path = "/user";

userRouter.patch(
  path,
  jwtMiddleware,
  upload.single("avatar"),
  validate(updateUserSchema),
  userController.update
);

// userRouter.patch(
//   path + "/upload-avatar",
//   jwtMiddleware,
//   upload.single("avatar"),
//   userController.changeAvatar
// );

export default userRouter;
