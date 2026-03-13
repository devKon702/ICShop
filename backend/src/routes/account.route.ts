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

// POST /admin/account/change-email/reject
accountRouter.post(
  adminPath + "/change-email/reject",
  validate(adminRejectChangeEmailSchema),
  accountController.adminRejectChangeEmail,
);

// POST /admin/account/change-email/confirm
accountRouter.post(
  adminPath + "/change-email/confirm",
  validate(adminConfirmChangeEmailSchema),
  accountController.adminConfirmChangeEmail,
);

// POST /admin/account/lock
accountRouter.post(
  adminPath + "/lock",
  validate(adminLockAccountSchema),
  accountController.adminLockAccount,
);

export default accountRouter;
