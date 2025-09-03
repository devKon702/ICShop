import { z } from "zod";
import {
  ID,
  UnsignedInt,
  UrlString,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const BannerSchema = z.object({
  id: ID,
  imageUrl: UrlString,
  position: z.number().int().min(0).max(255),
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export type Banner = z.infer<typeof BannerSchema>;
