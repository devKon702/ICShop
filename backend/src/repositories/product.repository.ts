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

  filter = async (
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
  public update = async () => {};
  public delete = async () => {};
}

export default new ProductRepository();
