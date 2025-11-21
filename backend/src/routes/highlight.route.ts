import express from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "../constants/db";
import highlightController from "../controllers/highlight.controller";
import {
  createHighlightSchema,
  deleteHighlightSchema,
  updateHighlightPositionSchema,
} from "../schemas/highlight.schema";
import { validate } from "../middlewares/validate.middleware";

const highlightRouter = express.Router();
const path = "/highlight";
const adminPath = "/admin/highlight";

// GET /highlight
highlightRouter.get(path, highlightController.getHighlight);

// GET /admin/highlight
highlightRouter.get(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  highlightController.adminGetHighlight
);

// POST /admin/highlight
highlightRouter.post(
  adminPath,
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(createHighlightSchema),
  highlightController.create
);

// PATCH /admin/highlight
highlightRouter.patch(
  adminPath + "/position",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(updateHighlightPositionSchema),
  highlightController.updatePosition
);

// DELETE /admin/highlight/:id
highlightRouter.delete(
  adminPath + "/:id",
  jwtMiddleware,
  authorize([Role.ADMIN]),
  validate(deleteHighlightSchema),
  highlightController.delete
);

export default highlightRouter;
