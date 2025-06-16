import express from "express";
import categoryRepository from "../repositories/category.repository";
import categoryController from "../controllers/category.controller";

const categoryRouter = express.Router();
const path = "/category";

categoryRouter.get(path, categoryController.getCategoryByName); //?name=&limit=
categoryRouter.get(path + "/overview", categoryController.getCategoryOverview);
categoryRouter.get(path + "/:slug", categoryController.getCategoryBySlug);

export default categoryRouter;
