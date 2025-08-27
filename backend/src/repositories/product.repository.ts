import { isAborted } from "zod";
import { prisma } from "../prisma";

class ProductRepository {
  public findBySlug = async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      omit: {
        version: true,
        creatorId: true,
        createdAt: true,
        modifierId: true,
        updatedAt: true,
        isActive: true,
      },
      include: {
        wholesale: {
          select: {
            id: true,
            min_quantity: true,
            max_quantity: true,
            quanity_step: true,
            unit: true,
            details: {
              select: {
                id: true,
                desc: true,
                min: true,
                max: true,
                price: true,
              },
            },
          },
        },
        attributes: {
          select: {
            id: true,
            attributeValue: {
              select: {
                id: true,
                value: true,
                attribute: { select: { name: true } },
              },
            },
          },
        },
        images: { select: { id: true, imageUrl: true, position: true } },
        category: {
          select: {
            name: true,
            slug: true,
            level: true,
            parent: {
              select: {
                name: true,
                slug: true,
                level: true,
                parent: { select: { name: true, slug: true, level: true } },
              },
            },
          },
        },
      },
    });
  };

  public findById = async (id: number) => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        creator: true,
        modifier: true,
        images: true,
        wholesale: { include: { details: true } },
        attributes: {
          include: { attributeValue: { include: { attribute: true } } },
        },
      },
    });
  };

  public findByName = async (name: string, page: number, limit: number) => {
    const productsPs = prisma.product.findMany({
      where: { name: { contains: name } },
      take: limit,
      skip: limit * (page - 1),
      omit: {
        version: true,
        createdAt: true,
        updatedAt: true,
        creatorId: true,
        modifierId: true,
        isActive: true,
      },
      include: {
        wholesale: {
          select: { unit: true, details: { select: { price: true }, take: 1 } },
        },
      },
    });
    const countPs = prisma.product.count({
      where: { name: { contains: name } },
    });
    return Promise.all([productsPs, countPs]);
  };

  public filter = async (
    cid: number | undefined,
    name: string | undefined,
    page: number,
    limit: number,
    order: "price_asc" | "price_desc" | "none",
    active: boolean | undefined
  ) => {
    const where: any = { isActive: active };
    if (cid !== undefined) {
      where.category = { id: cid };
    }

    // Lọc theo name
    if (name) {
      where.name = {
        contains: name,
      };
    }
    const omit = {
      version: true,
      createdAt: true,
      updatedAt: true,
      creatorId: true,
      modifierId: true,
      isActive: true,
    };

    let orderBy: any;
    switch (order) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "none":
        orderBy = undefined;
    }

    return Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        omit,
        orderBy,
        include: {
          wholesale: { include: { details: { take: 1 } } },
        },
      }),
      prisma.product.count({ where }),
    ]);
  };

  findByCategoryId = async (
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

  public create = async (
    userId: number,
    data: {
      name: string;
      categoryId: number;
      desc: string | null;
      datasheetLink: string | null;
      weight: number;
      vat: number;
      slug: string;
      price: number;
      wholesale: {
        min_quantity: number;
        max_quantity: number;
        unit: string;
        quantity_step: number;
        details: {
          min: number;
          max: number | null;
          price: number;
          desc: string;
        }[];
      };
      valueIds: number[];
    }
  ) => {
    return prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        categoryId: data.categoryId,
        desc: data.desc,
        datasheetLink: data.datasheetLink,
        weight: data.weight,
        vat: data.vat,
        creatorId: userId,
        modifierId: userId,
        wholesale: {
          create: {
            min_quantity: data.wholesale.min_quantity,
            max_quantity: data.wholesale.max_quantity,
            unit: data.wholesale.unit,
            quanity_step: data.wholesale.quantity_step,
            creatorId: userId,
            modifierId: userId,
            details: {
              create: data.wholesale.details.map((detail) => ({
                min: detail.min,
                max: detail.max,
                desc: detail.desc,
                price: detail.price,
                creatorId: userId,
                modifierId: userId,
              })),
            },
          },
        },
        attributes: {
          create: data.valueIds.map((item) => ({
            attributeValueId: item,
            creatorId: userId,
            modifierId: userId,
          })),
        },
      },
      include: {
        attributes: true,
        wholesale: { include: { details: true } },
      },
    });
  };
  public updateInfo = async (
    userId: number,
    productId: number,
    data: {
      name: string;
      datasheetLink: string | null;
      desc: string | null;
      weight: number;
      vat: number;
    }
  ) => {
    return prisma.product.update({
      where: { id: productId },
      data: { ...data, version: { increment: 1 }, modifierId: userId },
      include: { modifier: true },
    });
  };

  public updateCategory = async (
    userId: number,
    productId: number,
    data: { categoryId: number; vids: number[] }
  ) => {
    return prisma.product.update({
      where: { id: productId },
      data: {
        categoryId: data.categoryId,
        version: { increment: 1 },
        modifierId: userId,
        attributes: {
          createMany: {
            data: data.vids.map((item) => ({
              attributeValueId: item,
              creatorId: userId,
              modifierId: userId,
            })),
          },
        },
      },
      include: {
        modifier: true,
        attributes: {
          select: {
            attributeValue: {
              select: {
                id: true,
                value: true,
                attribute: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  };

  public updatePoster = async (
    userId: number,
    productId: number,
    posterUrl: string
  ) => {
    return prisma.product.update({
      where: {
        id: productId,
      },
      data: { posterUrl, modifierId: userId, version: { increment: 1 } },
      include: {
        modifier: true,
      },
    });
  };

  public updateActive = async (
    userId: number,
    productId: number,
    isActive: boolean
  ) => {
    return prisma.product.update({
      where: { id: productId },
      data: { isActive, modifierId: userId, version: { increment: 1 } },
    });
  };

  public updatePrice = async (
    userId: number,
    productId: number,
    price: number
  ) => {
    return prisma.product.update({
      where: { id: productId },
      data: { price, version: { increment: 1 }, modifierId: userId },
    });
  };

  public delete = async () => {};
}

export default new ProductRepository();
