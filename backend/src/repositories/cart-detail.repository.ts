import { prisma } from "../prisma";

const getCartDetailList = async (
  userId: number,
  page: number,
  limit: number
) => {
  return prisma.cartDetail.findMany({
    where: { userId },
    include: {
      product: { include: { images: { take: 1 } } },
    },
    take: limit,
    skip: (page - 1) * limit,
  });
};

export default { getCartDetailList };
