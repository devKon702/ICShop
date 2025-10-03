import { z } from "zod";

export const ID = z.number().int().nonnegative();
export const UnsignedInt = z.number().int().nonnegative();
export const UnsignedTinyInt = z.number().int().min(0).max(255);
export const TinyInt = z.number().int().min(-128).max(127);

export const UrlString = z.string().url();
export const NullableUrlString = UrlString.nullable().optional();

export const DecimalString = z.string();
export const DateTimeSchema = z.union([z.date(), z.string().datetime()]);

export const Slug = z.string().min(1);
export const TinyText = z.string();
export const Text = z.string();

export const RoleEnum = z.enum(["user", "admin"]);
export type Role = z.infer<typeof RoleEnum>;

export const HighlightTypeEnum = z.enum(["new", "hot", "bestsell"]);
export type HighlightType = z.infer<typeof HighlightTypeEnum>;
