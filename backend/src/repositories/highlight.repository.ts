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
        product: { include: { category: true } },
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

  public getHighlight = async (type: HighlightType, isActive?: boolean) => {
    return prisma.productHighlight.findMany({
      where: { type, product: { isActive } },
      include: {
        product: { include: { category: true } },
      },
    });
  };
}

export default new HighlightRepository();
