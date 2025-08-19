import express from "express";
import authController from "../controllers/auth.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

const authRouter = express.Router();
const path = "/auth";

authRouter.post(path + "/login", validate(loginSchema), authController.login);

authRouter.post(
  path + "/signup",
  validate(signupSchema),
  authController.signup
);

authRouter.post(path + "/logout", verifyAccessToken, authController.logout);

authRouter.post(path + "/refresh", authController.refresh);

authRouter.get(path + "/testToken", verifyAccessToken, authController.test);

export default authRouter;
