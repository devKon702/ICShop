import { z } from "zod";
import {
  ID,
  UnsignedInt,
  TinyText,
  Slug,
  DateTimeSchema,
} from "../schemas/shared.schema";
import { AttributeBaseSchema } from "@/libs/schemas/attribute.schema";
import { AttributeValueBaseSchema } from "@/libs/schemas/attribute-value.schema";

export const CategoryBaseSchema = z.object({
  id: ID,
  name: TinyText,
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

export const CreateCategorySchema = CategoryBaseSchema;
export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;

export const AdminCategoryTreeSchema = z.array(
  CategoryBaseSchema.extend({
    children: z.array(
      CategoryBaseSchema.extend({
        children: z.array(CategoryBaseSchema),
      })
    ),
  })
);

export const AdminCategorySchema = CategoryBaseSchema.extend({
  children: z.array(CategoryBaseSchema).optional(),
  attributes: z
    .array(
      AttributeBaseSchema.extend({
        values: z.array(AttributeValueBaseSchema),
      }).optional()
    )
    .optional(),
});
