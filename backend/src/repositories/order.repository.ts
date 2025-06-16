import { prisma } from "../prisma";

const getOrderByUserId = (userId: number, page: number, limit: number) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      deliveryType: true,
      details: true,
      orderStatus: true,
    },
    take: limit,
    skip: (page - 1) * limit,
  });
};

const getOrderByUserIdAndOrderStatusId = (
  userId: number,
  orderStatusId: number,
  page: number,
  limit: number
) => {
  return prisma.order.findMany({
    where: { userId, orderStatusId },
    include: {
      deliveryType: true,
      details: true,
      orderStatus: true,
    },
    take: limit,
    skip: (page - 1) * limit,
  });
};

export default { getOrderByUserId, getOrderByUserIdAndOrderStatusId };
