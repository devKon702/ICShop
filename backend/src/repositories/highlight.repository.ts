import { HighlightType } from "../constants/db";
import { prisma } from "../prisma";

class HighlightRepository {
  public create = async (
    userId: number,
    data: { productId: number; type: HighlightType }
  ) => {
    return prisma.productHighlight.create({
      data: {
        productId: data.productId,
        type: data.type,
        creatorId: userId,
        modifierId: userId,
      },
      include: {
        product: true,
      },
    });
  };

  public delete = async (id: number) => {
    return prisma.productHighlight.delete({ where: { id } });
  };

  public updatePosition = async (
    userId: number,
    highlightId: number,
    position: number
  ) => {
    return prisma.productHighlight.update({
      where: { id: highlightId },
      data: { position, modifierId: userId, version: { increment: 1 } },
    });
  };

  public getHighlight = async (type: HighlightType) => {
    return prisma.productHighlight.findMany({
      where: { type, product: { isActive: true } },
      select: {
        id: true,
        position: true,
        product: {
          select: {
            id: true,
            name: true,
            posterUrl: true,
            price: true,
            slug: true,
            wholesale: {
              select: {
                min_quantity: true,
                max_quantity: true,
                unit: true,
                quantity_step: true,
                id: true,
              },
            },
          },
        },
      },
    });
  };

  public getHighlightDetail = async (type: HighlightType) => {
    return prisma.productHighlight.findMany({
      where: { type },
      include: { product: { include: { creator: true, modifier: true } } },
    });
  };
}

export default new HighlightRepository();
