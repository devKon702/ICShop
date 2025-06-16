import express from "express";
import accountController from "../controllers/account.controller";

const accountRouter = express.Router();
const path = "/account";

accountRouter.get(path + "/:id", accountController.getAccountInformation);

export default accountRouter;
