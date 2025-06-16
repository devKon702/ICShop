import express from "express";
import productController from "../controllers/product.controller";

const productRouter = express.Router();
const path = "/product";

productRouter.get(path + "/:slug", productController.getProductBySlug);
productRouter.get(path + "/category/:categorySlug", productController.filter); // ?name=&attrids=1,2&page=&limit=
// productRouter.get(
//   path + "/category/:categoryId",
//   productController.getProductByCategoryId
// );

export default productRouter;
