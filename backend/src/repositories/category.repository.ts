import { prisma } from "../prisma";

class CategoryRepository {
  public findBySlug = async (slug: string) => {
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
  public getCategoryTree = async () => {
    return prisma.category.findMany({
      where: {
        level: 1,
      },
      include: {
        children: {
          include: { children: true },
        },
      },
    });
  };

  findByName = async (search: string, limit: number = 10) => {
    return prisma.category.findMany({
      where: { name: { contains: search } },
      take: limit,
    });
  };

  getCategoryOverview = async () => {
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

  public findById = async (id: number) => {
    return prisma.category.findUnique({
      where: { id },
      include: {},
    });
  };
  public create = async (
    userId: number,
    data: {
      name: string;
      slug: string;
      parentId?: number;
      imageUrl?: string;
      level: number;
    }
  ) => {
    return prisma.category.create({
      data: { ...data, creatorId: userId, modifierId: userId },
    });
  };
  public update = async (
    userId: number,
    categoryId: number,
    data: {
      name: string;
      slug: string;
      imageUrl: string | null;
      level: number;
      parentId: number | null;
    }
  ) => {
    return prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        level: data.level,
        slug: data.slug,
        parentId: data.parentId,
        version: { increment: 1 },
        modifierId: userId,
      },
    });
  };
  public delete = async (id: number) => {
    return prisma.category.delete({ where: { id } });
  };
}

export default new CategoryRepository();
