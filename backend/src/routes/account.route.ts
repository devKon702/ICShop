import express from "express";
import accountController from "../controllers/account.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  changePasswordSchema,
  filterAccountSchema,
  getAccountInfoSchema,
  changeAccountStatusSchema,
  updateUserEmailSchema,
  sendUpdateUserEmailOtpSchema,
  adminRequestChangeEmailSchema,
  adminRejectChangeEmailSchema,
  adminConfirmChangeEmailSchema,
  adminLockAccountSchema,
  adminRequestChangePasswordSchema,
  adminConfirmChangePasswordSchema,
  adminSendOtp2ChangeEmailSchema,
} from "../schemas/account.schema";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import {
  createFailureLimiter,
  createRateLimiter,
  createSuccessLimiter,
  RateLimitPolicies,
} from "../middlewares/limiter.middleware";

const accountRouter = express.Router();
const path = "/account";
const adminPath = "/admin/account";

// GET /account/me
accountRouter.get(
  path + "/me",
  jwtMiddleware,
  accountController.getMyInformation,
);

// GET /account/:id
accountRouter.get(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(getAccountInfoSchema),
  accountController.getInfo,
);

// GET /account?name=&email=&phone=&page=&limit=&role=
accountRouter.get(
  path,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(filterAccountSchema),
  accountController.filter,
);

// POST /account/change-email/send-otp
accountRouter.post(
  path + "/change-email/send-otp",
  jwtMiddleware,
  authorize([Role.USER]),
  validate(sendUpdateUserEmailOtpSchema),
  accountController.sendUpdateUserEmailOtp,
);

// PATCH /account/password
accountRouter.patch(
  path + "/password",
  jwtMiddleware,
  validate(changePasswordSchema),
  accountController.changePassword,
);

// PATCH /account/status
accountRouter.patch(
  path + "/status",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(changeAccountStatusSchema),
  accountController.changeStatus,
);

// PATCH /account/change-email
accountRouter.patch(
  path + "/change-email",
  jwtMiddleware,
  validate(updateUserEmailSchema),
  authorize([Role.USER]),
  accountController.updateUserEmail,
);

// POST /admin/account/change-email/request
accountRouter.post(
  adminPath + "/change-email/request",
  createRateLimiter(RateLimitPolicies.REQUEST_CHANGE_EMAIL_BY_IP),
  jwtMiddleware,
  authorize([Role.ADMIN]),
  createRateLimiter(RateLimitPolicies.REQUEST_CHANGE_EMAIL_BY_USER),
  validate(adminRequestChangeEmailSchema),
  accountController.adminRequestChangeEmail,
);

// POST /admin/account/change-email/confirm
accountRouter.post(
  adminPath + "/change-email/confirm",
  createRateLimiter(RateLimitPolicies.CONFIRM_CHANGE_EMAIL),
  validate(adminConfirmChangeEmailSchema),
  accountController.adminConfirmChangeEmail,
);

// POST /admin/account/change-email/send-otp
accountRouter.post(
  adminPath + "/change-email/send-otp",
  createRateLimiter(RateLimitPolicies.SENT_OTP),
  validate(adminSendOtp2ChangeEmailSchema),
  accountController.adminSendOtp2ChangeEmail,
);

// POST /admin/account/lock
accountRouter.post(
  adminPath + "/lock",
  createRateLimiter(RateLimitPolicies.LOCK_ADMIN_ACCOUNT),
  validate(adminLockAccountSchema),
  accountController.adminLockAccount,
);

// POST /admin/account/change-password/request
accountRouter.post(
  adminPath + "/change-password/request",
  createRateLimiter(RateLimitPolicies.ADMIN_REQUEST_CHANGE_PASSWORD),
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(adminRequestChangePasswordSchema),
  createFailureLimiter(
    RateLimitPolicies.FAILURE_REQUEST_CHANGE_PASSWORD,
    accountController.adminRequestChangePassword,
  ),
);

// POST /admin/account/change-password/confirm
accountRouter.post(
  adminPath + "/change-password/confirm",
  createRateLimiter(RateLimitPolicies.ADMIN_CONFIRM_CHANGE_PASSWORD),
  validate(adminConfirmChangePasswordSchema),
  accountController.adminConfirmChangePassword,
);

export default accountRouter;
