import { prisma } from "../prisma";

const findBySlug = async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      wholesale: { include: { details: true } },
      attributes: true,
      images: true,
      category: {
        include: {
          parent: { include: { parent: { include: { parent: true } } } },
        },
      },
    },
  });
};

const filter = async (
  categorySlug: string,
  attrids: BigInt[],
  name?: string,
  page: number = 1,
  limit: number = 10
) => {
  const where: any = { category: { slug: categorySlug } };

  // Lọc theo name
  if (name) {
    where.name = {
      contains: name,
    };
  }
  // Lọc theo attrid
  if (attrids.length != 0) {
    where.attributes = {
      some: {
        attributeValueId: {
          in: attrids,
        },
      },
    };
  }
  return Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        attributes: {
          include: {
            attributeValue: true,
          },
        },
        images: { take: 1 },
        wholesale: { include: { details: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);
};

const findByCategoryId = async (
  categoryId: number,
  page: number,
  limit: number
) => {
  return Promise.all([
    prisma.product.findMany({
      where: { categoryId },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.product.count({ where: { categoryId } }),
  ]);
};

export default { findBySlug, filter, findByCategoryId };
