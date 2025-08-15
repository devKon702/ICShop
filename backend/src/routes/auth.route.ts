import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../schemas/auth.schema";

const authRouter = express.Router();
const path = "/auth";

authRouter.post(path + "/login", validate(loginSchema), authController.login);

authRouter.post(path + "/signup", authController.signup);

authRouter.get(
  path + "/testToken",
  authMiddleware.verifyAccessToken,
  authController.test
);

export default authRouter;
