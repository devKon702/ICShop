import express from "express";
import accountController from "../controllers/account.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  changePasswordSchema,
  filterAccountSchema,
  getAccountInfoSchema,
  changeAccountStatusSchema,
} from "../schemas/account.schema";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";

const accountRouter = express.Router();
const path = "/account";

// GET /account/me
accountRouter.get(
  path + "/me",
  verifyAccessToken,
  accountController.getMyInformation
);

// GET /account/:id
accountRouter.get(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(getAccountInfoSchema),
  accountController.getInfo
);

// GET /account?name=&email=&phone=&page=&limit=&role=
accountRouter.get(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(filterAccountSchema),
  accountController.filter
);

// PATCH /account/password
accountRouter.patch(
  path + "/password",
  verifyAccessToken,
  validate(changePasswordSchema),
  accountController.changePassword
);

// PATCH /account/status
accountRouter.patch(
  path + "/status",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(changeAccountStatusSchema),
  accountController.changeStatus
);

export default accountRouter;
