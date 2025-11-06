import {
  DateTimeSchema,
  ID,
  Slug,
  Text,
  UnsignedInt,
  UnsignedTinyInt,
} from "@/libs/schemas/shared.schema";
import { z } from "zod";

export const CollectionBaseSchema = z.object({
  id: ID,
  name: Text,
  desc: Text,
  position: UnsignedTinyInt,
  slug: Slug,
  isActive: z.boolean(),
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafeCollectionBaseSchema = CollectionBaseSchema.omit({
  creatorId: true,
  modifierId: true,
  updatedAt: true,
  createdAt: true,
  version: true,
  isActive: true,
});
