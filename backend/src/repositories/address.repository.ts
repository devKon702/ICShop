import { prisma } from "../prisma";

class AddressRepository {
  public findByUserId = async (userId: number) => {
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
      data,
    });
  };

  public update = async (
    addressId: number,
    data: {
      alias: string;
      receiverPhone: string;
      receiverName: string;
      detail: string;
      commune: string;
      district: string;
      province: string;
    }
  ) => {
    return prisma.address.update({ data, where: { id: addressId } });
  };
  public delete = async (id: number) => {
    return prisma.address.delete({ where: { id } });
  };

  public findById = async (id: number) => {
    return prisma.address.findUnique({ where: { id } });
  };
}

export default new AddressRepository();
