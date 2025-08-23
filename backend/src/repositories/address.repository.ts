import { prisma } from "../prisma";

class AddressRepository {
  public findAddressByUserId = async (userId: number) => {
    return prisma.address.findMany({
      where: { userId },
    });
  };

  public create = async (data: {
    userId: number;
    alias: string;
    receiverPhone: string;
    receiverName: string;
    detail: string;
    commune: string;
    district: string;
    province: string;
  }) => {
    return prisma.address.create({
      data: { ...data },
    });
  };

  public update = async (data: {}) => {};
  public delete = async (data: {}) => {};
}

export default new AddressRepository();
