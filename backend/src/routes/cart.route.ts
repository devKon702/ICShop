import express from "express";
import cartController from "../controllers/cart.controller";

const cartRouter = express.Router();
const path = "/cart";

cartRouter.get(path + "/:userId", cartController.getCartDetailList);

export default cartRouter;
