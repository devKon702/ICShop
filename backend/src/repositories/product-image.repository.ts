import { prisma } from "../prisma";

class ProductImageRepository {
  public create = async (userId: number, productId: number, url: string) => {
    return prisma.productImage.create({
      data: { productId, creatorId: userId, modifierId: userId, imageUrl: url },
    });
  };
  public update = async (userId: number, id: number, url: string) => {
    return prisma.productImage.update({
      where: { id },
      data: { version: { increment: 1 }, modifierId: userId, imageUrl: url },
    });
  };

  public delete = async (id: number) => {
    return prisma.productImage.delete({ where: { id } });
  };
}

export default new ProductImageRepository();
