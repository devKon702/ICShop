import express from "express";
import authController from "../controllers/auth.controller";

const authRouter = express.Router();
const path = "/auth";

authRouter.post(path + "/login", authController.login);
export default authRouter;
