import { prisma } from "../prisma";

class ProductImageRepository {
  public findById = async (id: number) => {
    return prisma.productImage.findUnique({
      where: { id },
    });
  };
  public findByProductId = async (productId: number) => {
    return prisma.productImage.findMany({
      where: { productId },
    });
  };
  public deleteByProductId = async (productId: number) => {
    return prisma.productImage.deleteMany({
      where: {},
    });
  };
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
  public updateImage = async (userId: number, id: number, url: string) => {
    return prisma.productImage.update({
      where: { id },
      data: { imageUrl: url, modifierId: userId, version: { increment: 1 } },
    });
  };
}

export default new ProductImageRepository();
