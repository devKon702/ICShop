import { prisma } from "../prisma";

export class AttributeRepository {
  public findById = async (id: number) => {
    return prisma.attribute.findUnique({ where: { id } });
  };

  public create = async (
    userId: number,
    data: { name: string; categoryId: number }
  ) => {
    return prisma.attribute.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        creatorId: userId,
        modifierId: userId,
      },
    });
  };

  public update = async (
    userId: number,
    attrid: number,
    data: { name: string }
  ) => {
    return prisma.attribute.update({
      where: { id: attrid },
      data: { name: data.name, version: { increment: 1 }, modifierId: userId },
    });
  };

  public delete = async (id: number) => {
    return prisma.attribute.delete({ where: { id } });
  };
}

export default new AttributeRepository();
