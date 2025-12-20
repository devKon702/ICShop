import express from "express";
import authController from "../controllers/auth.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  loginWithGoogleSchema,
  resetPasswordSchema,
  sendEmailOTPSchema,
  signupSchema,
} from "../schemas/auth.schema";
import { Role } from "../constants/db";
import {
  createLimiter,
  loginLimiter,
  refreshTokenLimiter,
  sendOtpLimiter,
  signupLimiter,
} from "../middlewares/limiter.middleware";

const authRouter = express.Router();
const path = "/auth";
const adminPath = "/admin/auth";

// POST /auth/login
authRouter.post(
  path + "/login",
  loginLimiter,
  validate(loginSchema),
  authController.login(Role.USER)
);

// POST /auth/google
authRouter.post(
  path + "/google",
  loginLimiter,
  validate(loginWithGoogleSchema),
  authController.loginWithGoogle
);

// POST /admin/auth/login
authRouter.post(
  adminPath + "/login",
  loginLimiter,
  validate(loginSchema),
  authController.login(Role.ADMIN)
);

// POST /auth/signup
authRouter.post(
  path + "/signup",
  signupLimiter,
  validate(signupSchema),
  authController.signup
);

// POST /auth/logout
authRouter.post(path + "/logout", jwtMiddleware, authController.logout);

// POST /auth/refresh
authRouter.post(path + "/refresh", refreshTokenLimiter, authController.refresh);

// POST /auth/otp
authRouter.post(
  path + "/otp",
  sendOtpLimiter,
  // jwtMiddleware,
  validate(sendEmailOTPSchema),
  authController.sendEmailOTP
);

// POST /auth/forgot-password
authRouter.post(
  path + "/forgot-password",
  createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
  }),
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// POST /auth/reset-password
authRouter.post(
  path + "/reset-password",
  createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
  }),
  validate(resetPasswordSchema),
  authController.resetPassword
);

// POST /auth/testToken
authRouter.get(path + "/testToken", jwtMiddleware, authController.test);

// GET /auth/redis
authRouter.get(path + "/redis", authController.testRedis);

export default authRouter;
