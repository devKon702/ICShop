import { Environment } from "@prisma/client";
import { prisma } from "../prisma";

class PaymentMethodRepository {
  public findById(
    id: number,
    options?: {
      includeConfig?: boolean;
      isActive?: boolean;
      environment?: Environment;
    },
  ) {
    return prisma.paymentMethod.findUnique({
      where: {
        id,
        isActive: options?.isActive,
      },
      include: {
        paymentConfigs: {
          where: {
            isActive: options?.isActive,
            environment: options?.environment,
          },
        },
      },
    });
  }

  public findMany(options?: {
    isActive?: boolean;
    includeConfig?: boolean;
    environment?: Environment;
  }) {
    return prisma.paymentMethod.findMany({
      where: {
        isActive: options?.isActive,
        paymentConfigs: {
          some: {
            environment: options?.environment,
          },
        },
      },
      include: {
        paymentConfigs: {
          where: {
            environment: options?.environment,
            isActive: options?.isActive,
          },
        },
      },
    });
  }

  public create(data: {
    code: string;
    name: string;
    desc: string;
    position?: number;
    isActive?: boolean;
    creatorId: number;
  }) {
    return prisma.paymentMethod.create({
      data: { ...data, modifierId: data.creatorId },
    });
  }

  public update(
    id: number,
    data: {
      code?: string;
      name?: string;
      desc?: string;
      isActive?: boolean;
      position?: number;
      modifierId: number;
    },
  ) {
    return prisma.paymentMethod.update({
      where: { id },
      data: { ...data, version: { increment: 1 } },
    });
  }

  public delete(id: number) {
    return prisma.paymentMethod.delete({ where: { id } });
  }
}

export default new PaymentMethodRepository();
