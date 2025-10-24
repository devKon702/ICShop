import { prisma } from "../prisma";

class ProductAttributeRepository {
  public findByProductSlug = async (slug: string) => {
    return prisma.productAttribute.findMany({
      where: { product: { slug } },
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
    });
  };

  public findByProductId = async (productId: number) => {
    return prisma.productAttribute.findMany({
      where: { productId },
      include: {
        attributeValue: {
          include: {
            attribute: true,
          },
        },
      },
    });
  };
}

export default new ProductAttributeRepository();
