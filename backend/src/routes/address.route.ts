import express from "express";
import addressController from "../controllers/address.controller";

const addressRouter = express.Router();
const path = "/address";

addressRouter.get(path + "/:userId", addressController.getAddressByUserId);

export default addressRouter;
