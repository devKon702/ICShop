import { prisma } from "../prisma";

const findAddressByUserId = (userId: number) => {
  return prisma.address.findMany({
    where: { userId },
  });
};

export default { findAddressByUserId };
