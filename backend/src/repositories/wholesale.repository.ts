import { prisma } from "../prisma";

class WholesaleRepository {
  public findByProductId = async (
    productId: number,
    includeDetails: boolean = false
  ) => {
    return prisma.wholesale.findUnique({
      where: { productId },
      include: { details: includeDetails },
    });
  };
  public update = async (
    userId: number,
    wholesaleId: number,
    data: {
      wholesale?: {
        min_quantity: number;
        max_quantity: number;
        unit: string;
        quantity_step: number;
        vat: number;
      };
      details?: {
        min: number;
        max: number | null;
        price: number;
        desc: string;
      }[];
    }
  ) => {
    return prisma.$transaction(async (tx) => {
      if (data.details) {
        // Delete all existing details
        await tx.wholesaleDetail.deleteMany({
          where: { wholesaleId },
        });
        // Update product price to match the first detail price
        await tx.product.updateMany({
          where: { wholesale: { id: wholesaleId } },
          data: {
            price: data.details[0].price || 0,
            version: { increment: 1 },
            modifierId: userId,
          },
        });
      }
      // Update wholesale info and add new details
      return await tx.wholesale.update({
        where: { id: wholesaleId },
        data: {
          ...(data.wholesale && {
            min_quantity: data.wholesale.min_quantity,
            max_quantity: data.wholesale.max_quantity,
            unit: data.wholesale.unit,
            quantity_step: data.wholesale.quantity_step,
            vat: data.wholesale.vat,
            version: { increment: 1 },
            modifierId: userId,
          }),
          ...(data.details && {
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
          }),
        },
        include: { details: true },
      });
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
      select: {
        price: true,
        wholesale: {
          select: {
            vat: true,
            min_quantity: true,
            max_quantity: true,
            quantity_step: true,
            unit: true,
          },
        },
      },
    });
  };

  public findByProductSlug = async (slug: string) => {
    return prisma.wholesale.findFirst({
      where: { product: { slug } },
      select: {
        id: true,
        min_quantity: true,
        max_quantity: true,
        quantity_step: true,
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
