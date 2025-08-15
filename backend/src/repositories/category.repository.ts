import { prisma } from "../prisma";

const findBySlug = async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: { include: { parent: true } },
      children: {
        include: {
          children: true,
        },
      },
      products: true,
      attributes: {
        include: { values: { include: { attribute: true } } },
      },
    },
  });
};

const findByName = async (search: string, limit: number = 10) => {
  return prisma.category.findMany({
    where: { name: { contains: search } },
    take: limit,
  });
};

const getCategoryOverview = async () => {
  return prisma.category.findMany({
    where: { level: 1 },
    select: {
      id: true,
      slug: true,
      name: true,
      level: true,
      imageUrl: true,
      children: {
        select: {
          id: true,
          slug: true,
          name: true,
          level: true,
          children: {
            select: {
              id: true,
              slug: true,
              name: true,
              level: true,
              products: {
                take: 5,
                include: {
                  wholesale: { include: { details: { take: 1 } } },
                  images: { take: 1 },
                },
              },
            },
          },
        },
      },
    },
  });
};

export default {
  findBySlug,
  findByName,
  getCategoryOverview,
};
