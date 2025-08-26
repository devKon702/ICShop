import { prisma } from "../prisma";

class ProductRepository {
  findBySlug = async (slug: string) => {
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
      desc: string;
      datasheetLink?: string;
      weight: number;
      vat: number;
      slug: string;
      posterUrl: string;
      wholesale: {
        min_quantity: number;
        max_quantity: number;
        unit: string;
        quantity_step: number;
        details: {
          min: number;
          max: number;
          price: number;
          desc: string;
        }[];
      };
      valueIds: number[];
      imageUrls: string[];
    }
  ) => {
    return prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        categoryId: data.categoryId,
        posterUrl: data.posterUrl,
        desc: data.desc,
        datasheetLink: data.datasheetLink,
        weight: data.weight,
        vat: data.vat,
        wholesale: {
          create: {
            min_quantity: data.wholesale.min_quantity,
            max_quantity: data.wholesale.max_quantity,
            unit: data.wholesale.unit,
            quanity_step: data.wholesale.quantity_step,
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
        images: {
          create: data.imageUrls.map((url) => ({
            imageUrl: url,
            creatorId: userId,
            modifierId: userId,
            position: 1,
          })),
        },
        creatorId: userId,
        modifierId: userId,
      },
      include: {
        attributes: true,
        images: true,
        wholesale: { include: { details: true } },
      },
    });
  };
  public update = async () => {};
  public delete = async () => {};
}

export default new ProductRepository();
