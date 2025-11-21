import express from "express";
import accountController from "../controllers/account.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  changePasswordSchema,
  filterAccountSchema,
  getAccountInfoSchema,
  changeAccountStatusSchema,
  updateMyEmailSchema,
} from "../schemas/account.schema";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";

const accountRouter = express.Router();
const path = "/account";

// GET /account/me
accountRouter.get(
  path + "/me",
  jwtMiddleware,
  accountController.getMyInformation
);

// GET /account/:id
accountRouter.get(
  path + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(getAccountInfoSchema),
  accountController.getInfo
);

// GET /account?name=&email=&phone=&page=&limit=&role=
accountRouter.get(
  path,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(filterAccountSchema),
  accountController.filter
);

// PATCH /account/password
accountRouter.patch(
  path + "/password",
  jwtMiddleware,
  validate(changePasswordSchema),
  accountController.changePassword
);

// PATCH /account/status
accountRouter.patch(
  path + "/status",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(changeAccountStatusSchema),
  accountController.changeStatus
);

// PATCH /account/email
accountRouter.patch(
  path + "/email",
  jwtMiddleware,
  validate(updateMyEmailSchema),
  accountController.updateMyEmail
);

export default accountRouter;
