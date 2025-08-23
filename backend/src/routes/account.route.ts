import express from "express";
import accountController from "../controllers/account.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  changePasswordSchema,
  filterAccountSchema,
  getAccountInfoSchema,
  lockAccountSchema,
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

// GET /account?name=&email=&page=&limit=&role=
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

// PATCH /account/lock
accountRouter.patch(
  path + "/lock",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(lockAccountSchema),
  accountController.lockAccount
);

export default accountRouter;
