import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyText,
  Slug,
  DateTimeSchema,
} from "../schemas/shared.schema";

export const CategoryBaseSchema = z.object({
  id: ID,
  name: TinyText, // Prisma dùng TEXT, ở client chỉ cần string
  imageUrl: z.string().url().nullable().optional(),
  parentId: UnsignedInt.nullable().optional(),
  level: z.number().int().min(1).max(3),
  slug: Slug,
  isActive: z.boolean(),
  version: z.number().int(),
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CategorySchema = CategoryBaseSchema.extend({
  // tránh embed Product[] để không nặng payload
  // chỉ embed children basic (không đệ quy sâu để tránh mảng vô hạn)
  children: z
    .array(
      CategoryBaseSchema.pick({
        id: true,
        name: true,
        imageUrl: true,
        parentId: true,
        level: true,
        slug: true,
        isActive: true,
      })
    )
    .optional(),
});
export type Category = z.infer<typeof CategorySchema>;
