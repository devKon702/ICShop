import express from "express";
import accountController from "../controllers/account.controller";
import { verifyToken } from "../middlewares/jwt.middleware";

const accountRouter = express.Router();
const path = "/account";

accountRouter.get(
  path + "/me",
  verifyToken,
  accountController.getMyInformation
);

accountRouter.get(path + "/:id", accountController.getAccountInformation);

export default accountRouter;
