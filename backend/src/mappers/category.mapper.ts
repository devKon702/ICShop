import { Category } from "@prisma/client";

export type PublicCategory = {
  id: number;
  name: string;
  imageUrl?: string | null;
  parentId?: number | null;
  level: number;
  slug: string;
  children?: PublicCategory[];
  parent?: PublicCategory;
};

export function toPublicCategory(
  category: Category & { children?: Category[]; parent?: Category }
): PublicCategory {
  return {
    id: category.id,
    name: category.name,
    imageUrl: category.imageUrl,
    parentId: category.parentId,
    level: category.level,
    slug: category.slug,
    children: category.children
      ? category.children.map(toPublicCategory)
      : undefined,
    parent: category.parent ? toPublicCategory(category.parent) : undefined,
  };
}
