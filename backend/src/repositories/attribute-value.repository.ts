import { prisma } from "../prisma";

export class AttributeValueRepository {
  public findById = async (id: number) => {
    return prisma.attributeValue.findUnique({ where: { id } });
  };
  public create = async (
    userId: number,
    data: { attributeId: number; value: string }
  ) => {
    return prisma.attributeValue.create({
      data: {
        attributeId: data.attributeId,
        value: data.value,
        creatorId: userId,
        modifierId: userId,
      },
    });
  };
  public update = async (
    userId: number,
    id: number,
    data: { value: string }
  ) => {
    return prisma.attributeValue.update({
      where: { id },
      data: {
        value: data.value,
        version: { increment: 1 },
        modifierId: userId,
      },
    });
  };
  public delete = async (id: number) => {
    return prisma.attributeValue.delete({ where: { id } });
  };
}

export default new AttributeValueRepository();
