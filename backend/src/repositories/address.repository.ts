import { prisma } from "../prisma";

class AddressRepository {
  public findByUserId = async (userId: number) => {
    return prisma.address.findMany({
      where: { userId },
      include: {
        province: true,
        district: true,
        ward: true,
      },
    });
  };

  public create = async (data: {
    userId: number;
    alias: string;
    receiverPhone: string;
    receiverName: string;
    detail: string;
    wardId: number;
    districtId: number;
    provinceId: number;
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
      wardId: number;
      districtId: number;
      provinceId: number;
    }
  ) => {
    return prisma.address.update({ data, where: { id: addressId } });
  };
  public delete = async (id: number) => {
    return prisma.address.delete({ where: { id } });
  };

  public findById = async (id: number) => {
    return prisma.address.findUnique({
      where: { id },
      include: {
        province: true,
        district: true,
        ward: true,
      },
    });
  };
}

export default new AddressRepository();
