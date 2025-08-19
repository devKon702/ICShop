import express from "express";
import accountController from "../controllers/account.controller";
import { verifyAccessToken } from "../middlewares/jwt.middleware";

const accountRouter = express.Router();
const path = "/account";

accountRouter.get(
  path + "/me",
  verifyAccessToken,
  accountController.getMyInformation
);

accountRouter.get(path + "/:id", accountController.getAccountInformation);

export default accountRouter;
