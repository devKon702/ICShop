import { prisma } from "../prisma";

class ProductImageRepository {
  public create = async (userId: number, productId: number, url: string) => {
    return prisma.productImage.create({
      data: { productId, creatorId: userId, modifierId: userId, imageUrl: url },
    });
  };

  public delete = async (id: number) => {
    return prisma.productImage.delete({ where: { id } });
  };

  public updatePosition = async (
    userId: number,
    data: { id: number; position: number }[]
  ) => {
    return Promise.all(
      data.map((item) =>
        prisma.productImage.update({
          where: { id: item.id },
          data: {
            position: item.position,
            version: { increment: 1 },
            modifierId: userId,
          },
        })
      )
    );
  };
}

export default new ProductImageRepository();
