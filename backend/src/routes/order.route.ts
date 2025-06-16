import express from "express";
import orderController from "../controllers/order.controller";

const orderRouter = express.Router();
const path = "/order";

orderRouter.get(path, orderController.getOrderByUserId); //?userId=&page=&limit=&orderStatusId=

export default orderRouter;
