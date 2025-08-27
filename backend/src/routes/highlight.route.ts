import express from "express";
import { verifyAccessToken } from "../middlewares/jwt.middleware";
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

// GET /highlight
highlightRouter.get(path, highlightController.getHighlight);

// GET /highlight/detail
highlightRouter.get(
  path + "/detail",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  highlightController.getHighlightDetail
);

// POST /highlight
highlightRouter.post(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(createHighlightSchema),
  highlightController.create
);

// PATCH /highlight
highlightRouter.patch(
  path,
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(updateHighlightPositionSchema),
  highlightController.updatePosition
);

// DELETE /highlight/:id
highlightRouter.delete(
  path + "/:id",
  verifyAccessToken,
  authorize([Role.ADMIN]),
  validate(deleteHighlightSchema),
  highlightController.delete
);

export default highlightRouter;
