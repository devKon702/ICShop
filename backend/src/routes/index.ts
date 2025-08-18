import express from "express";
import productRouter from "./product.route";
import categoryRouter from "./category.route";
import authRouter from "./auth.route";
import cartRouter from "./cart.route";
import accountRouter from "./account.route";
import addressRouter from "./address.route";
import orderRouter from "./order.route";
import userRouter from "./user.route";

const router = express.Router();

router.use("/v1", productRouter);
router.use("/v1", categoryRouter);
router.use("/v1", authRouter);
router.use("/v1", cartRouter);
router.use("/v1", accountRouter);
router.use("/v1", userRouter);
router.use("/v1", addressRouter);
router.use("/v1", orderRouter);

export default router;
