import express from "express";
import authController from "../controllers/auth.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import { Role } from "../constants/db";

const authRouter = express.Router();
const path = "/auth";
const adminPath = "/admin/auth";

// POST /auth/login
authRouter.post(
  path + "/login",
  validate(loginSchema),
  authController.login(Role.USER)
);

// POST /admin/auth/login
authRouter.post(
  adminPath + "/login",
  validate(loginSchema),
  authController.login(Role.ADMIN)
);

// POST /auth/signup
authRouter.post(
  path + "/signup",
  validate(signupSchema),
  authController.signup
);

// POST /auth/logout
authRouter.post(path + "/logout", verifyAccessToken, authController.logout);

// POST /auth/refresh
authRouter.post(path + "/refresh", authController.refresh);

// POST /auth/testToken
authRouter.get(path + "/testToken", verifyAccessToken, authController.test);

// GET /auth/redis
authRouter.get(path + "/redis", authController.testRedis);

export default authRouter;
