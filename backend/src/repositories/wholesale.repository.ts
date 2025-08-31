import { prisma } from "../prisma";

class WholesaleRepository {
  public updateWholesaleByProductId = async (
    userId: number,
    productId: number,
    data: {
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
    }
  ) => {
    return prisma.wholesale.update({
      where: { productId },
      data: {
        min_quantity: data.min_quantity,
        max_quantity: data.max_quantity,
        quanity_step: data.quantity_step,
        unit: data.unit,
        modifierId: userId,
        version: { increment: 1 },
        details: {
          createMany: {
            data: data.details.map((item) => ({
              min: item.min,
              max: item.max,
              price: item.price,
              desc: item.desc,
              creatorId: userId,
              modifierId: userId,
            })),
          },
        },
      },
      include: { details: true },
    });
  };

  public deleteAllDetailByProductId = async (
    productId: number,
    excludeIds: number[]
  ) => {
    return prisma.wholesaleDetail.deleteMany({
      where: { wholesale: { productId }, id: { notIn: excludeIds } },
    });
  };

  public findByQuantity = async (productId: number, quantity: number) => {
    return prisma.wholesaleDetail.findFirst({
      where: {
        wholesale: { productId },
        min: { lte: quantity },
        OR: [{ max: { gte: quantity } }, { max: null }],
      },
      orderBy: {
        min: "desc",
      },
      select: { price: true },
    });
  };

  public findByProductSlug = async (slug: string) => {
    return prisma.wholesale.findFirst({
      where: { product: { slug } },
      select: {
        id: true,
        min_quantity: true,
        max_quantity: true,
        quanity_step: true,
        unit: true,
        vat: true,
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
    });
  };
}

export default new WholesaleRepository();
