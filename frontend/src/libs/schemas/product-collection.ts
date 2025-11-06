import {
  DateTimeSchema,
  UnsignedInt,
  UnsignedTinyInt,
} from "@/libs/schemas/shared.schema";
import { z } from "zod";

export const ProductCollectionBaseSchema = z.object({
  id: UnsignedInt,
  productId: UnsignedInt,
  collectionId: UnsignedInt,
  position: UnsignedTinyInt,
  version: UnsignedInt,
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafeProductCollectionBaseSchema = ProductCollectionBaseSchema.omit(
  {
    version: true,
    creatorId: true,
    modifierId: true,
    updatedAt: true,
    createdAt: true,
  }
);
