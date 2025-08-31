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
            },
          },
        },
      },
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
