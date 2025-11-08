import { z } from "zod";
import {
  UnsignedInt,
  UnsignedTinyInt,
  DateTimeSchema,
  HighlightTypeEnum,
} from "./shared.schema";

export const ProductHighlightBaseSchema = z.object({
  id: z.number().int().min(0).max(255), // UnsignedTinyInt
  productId: UnsignedInt,
  type: HighlightTypeEnum,
  position: UnsignedTinyInt,
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafeProductHighlightBaseSchema = ProductHighlightBaseSchema.omit({
  version: true,
  creatorId: true,
  modifierId: true,
  createdAt: true,
  updatedAt: true,
});

export type ProductHighlight = z.infer<typeof ProductHighlightBaseSchema>;
