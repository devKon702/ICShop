import { prisma } from "../prisma";

class CartRepository {
  public getCart = (userId: number) => {
    return prisma.cartDetail.findMany({
      where: { userId, product: { isActive: true } },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            posterUrl: true,
            price: true,
            wholesale: {
              select: {
                productId: true,
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
                    wholesaleId: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  };

  public getCartDetailByProductId = (userId: number, productId: number) => {
    return prisma.cartDetail.findFirst({
      where: { userId, productId },
    });
  };

  public updateCart = (id: number) => {
    return prisma.cartDetail.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  };

  public createCart = (userId: number, productId: number) => {
    return prisma.cartDetail.create({
      data: { userId, productId },
    });
  };

  public deleteCart = (id: number, userId: number) => {
    return prisma.cartDetail.delete({
      where: { id, userId },
      select: { id: true },
    });
  };
}
export default new CartRepository();
