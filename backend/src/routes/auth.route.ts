import express from "express";
import authController from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/jwt.middleware";
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

authRouter.post(path + "/logout", verifyToken, authController.logout);

authRouter.get(path + "/testToken", verifyToken, authController.test);

export default authRouter;
