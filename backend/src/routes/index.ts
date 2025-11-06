import express from "express";
import productRouter from "./product.route";
import categoryRouter from "./category.route";
import authRouter from "./auth.route";
import cartRouter from "./cart.route";
import accountRouter from "./account.route";
import addressRouter from "./address.route";
import orderRouter from "./order.route";
import userRouter from "./user.route";
import attributeRouter from "./attribute.route";
import attributeValueRouter from "./attribute-value.route";
import highlightRouter from "./highlight.route";
import productImageRouter from "./product-image.route";
import locationRouter from "./location.route";
import statisticsRouter from "./statistics.route";
import collectionRouter from "./collection.route";

const router = express.Router();

router.use("/v1", authRouter);
router.use("/v1", accountRouter);
router.use("/v1", userRouter);
router.use("/v1", addressRouter);
router.use("/v1", categoryRouter);
router.use("/v1", attributeRouter);
router.use("/v1", attributeValueRouter);
router.use("/v1", productRouter);
router.use("/v1", productImageRouter);
router.use("/v1", highlightRouter);
router.use("/v1", cartRouter);
router.use("/v1", orderRouter);
router.use("/v1", locationRouter);
router.use("/v1", statisticsRouter);
router.use("/v1", collectionRouter);

export default router;
