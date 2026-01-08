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
  createFailureLimiter,
  createRateLimiter,
  RateLimitPolicies,
} from "../middlewares/limiter.middleware";

const authRouter = express.Router();
const path = "/auth";
const adminPath = "/admin/auth";

// POST /auth/login
authRouter.post(
  path + "/login",
  createRateLimiter(RateLimitPolicies.LOGIN),
  validate(loginSchema),
  authController.login(Role.USER)
);

// POST /auth/google
authRouter.post(
  path + "/google",
  createRateLimiter(RateLimitPolicies.LOGIN),
  validate(loginWithGoogleSchema),
  authController.loginWithGoogle
);

// POST /admin/auth/login
authRouter.post(
  adminPath + "/login",
  createRateLimiter(RateLimitPolicies.ADMIN_LOGIN),
  validate(loginSchema),
  createFailureLimiter(
    RateLimitPolicies.ADMIN_LOGIN,
    authController.login(Role.ADMIN)
  )
);

// POST /auth/signup
authRouter.post(
  path + "/signup",
  createRateLimiter(RateLimitPolicies.REGISTER),
  validate(signupSchema),
  authController.signup
);

// POST /auth/logout
authRouter.post(path + "/logout", jwtMiddleware, authController.logout);

// POST /auth/refresh
authRouter.post(path + "/refresh", authController.refresh);

// POST /auth/otp
authRouter.post(
  path + "/otp",
  createRateLimiter(RateLimitPolicies.SENT_OTP),
  validate(sendEmailOTPSchema),
  authController.sendEmailOTP
);

// POST /auth/forgot-password
authRouter.post(
  path + "/forgot-password",
  createRateLimiter(RateLimitPolicies.FORGOT_PASSWORD),
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// POST /auth/reset-password
authRouter.post(
  path + "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// POST /auth/testToken
authRouter.get(path + "/testToken", jwtMiddleware, authController.testToken);

// GET /auth/redis
authRouter.get(
  path + "/test",
  createRateLimiter({
    name: "TEST",
    windowMs: 30 * 1000,
    max: 3,
    type: "CAPTCHA",
  }),
  authController.test
);

export default authRouter;
