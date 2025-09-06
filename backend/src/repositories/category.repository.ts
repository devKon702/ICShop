import { isAborted } from "zod";
import { prisma } from "../prisma";

class CategoryRepository {
  public findBySlug = async (
    slug: string,
    filter: {
      vids: number[] | undefined;
      limit: number;
      page: number;
      order: "price_asc" | "price_desc";
    }
  ) => {
    const categorySelect = {
      id: true,
      imageUrl: true,
      level: true,
      name: true,
      slug: true,
      parentId: true,
    };
    const productWhere: any = filter.vids
      ? { attributes: { some: { id: { in: filter.vids } } }, isActive: true }
      : { isActive: true };
    return prisma.category.findUnique({
      where: { slug, isActive: true },
      select: {
        ...categorySelect,
        _count: { select: { products: { where: productWhere } } },
        parent: {
          select: { ...categorySelect, parent: { select: categorySelect } },
        },
        children: {
          select: { ...categorySelect, children: { select: categorySelect } },
        },
        products: {
          where: { ...productWhere },
          take: filter.limit,
          skip: filter.limit * (filter.page - 1),
          select: {
            id: true,
            name: true,
            slug: true,
            posterUrl: true,
            price: true,
          },
          orderBy: { price: filter.order === "price_asc" ? "asc" : "desc" },
        },
        attributes: {
          select: {
            id: true,
            name: true,
            values: { select: { id: true, value: true } },
          },
        },
      },
    });
  };

  public getCategoryTree4User = async () => {
    const categorySelect = {
      id: true,
      name: true,
      slug: true,
      level: true,
      imageUrl: true,
    };
    return prisma.category.findMany({
      where: { level: 1, isActive: true },
      select: {
        ...categorySelect,
        children: {
          where: { isActive: true },
          select: {
            ...categorySelect,
            children: {
              where: { isActive: true },
              select: { ...categorySelect },
            },
          },
        },
      },
    });
  };
  public getCategoryTree4Admin = async () => {
    return prisma.category.findMany({
      where: {
        level: 1,
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                attributes: { include: { values: true } },
              },
            },
          },
        },
      },
    });
  };

  public getLeafCategory = async () => {
    return prisma.category.findMany({
      where: { level: 3 },
    });
  };
  // ?
  findByName = async (search: string, limit: number = 10) => {
    return prisma.category.findMany({
      where: { name: { contains: search } },
      take: limit,
    });
  };
  // ?
  getProductFromRoot = async (id: number, limit: number) => {
    return prisma.category.findMany({
      where: { id, level: 1, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        level: true,
        imageUrl: true,
        children: {
          where: { isActive: true },
          select: {
            id: true,
            slug: true,
            name: true,
            level: true,
            children: {
              where: { isActive: true },
              select: {
                id: true,
                slug: true,
                name: true,
                level: true,
                products: {
                  where: { isActive: true },
                  take: limit,
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    posterUrl: true,
                    price: true,
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
      include: {
        attributes: {
          select: { name: true, values: { select: { id: true, value: true } } },
        },
      },
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
