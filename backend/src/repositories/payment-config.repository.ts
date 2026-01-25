import { Environment } from "@prisma/client";
import { prisma } from "../prisma";

class PaymentConfigRepository {
  public findById(id: number) {
    return prisma.paymentConfig.findUnique({
      where: { id },
    });
  }

  public findByMethodId(methodId: number, options?: { isActive?: boolean }) {
    return prisma.paymentConfig.findMany({
      where: {
        paymentMethodId: methodId,
        isActive: options?.isActive,
      },
    });
  }

  public create(data: {
    paymentMethodId: number;
    environment: Environment;
    publicConfig: string;
    privateConfig: string;
    isActive?: boolean;
    creatorId: number;
  }) {
    return prisma.paymentConfig.create({
      data: { ...data, modifierId: data.creatorId },
    });
  }

  public update(
    id: number,
    data: {
      publicConfig?: string;
      privateConfig?: string;
      isActive?: boolean;
      environment?: Environment;
      modifierId: number;
    },
  ) {
    return prisma.paymentConfig.update({
      where: { id },
      data: { ...data, version: { increment: 1 } },
    });
  }

  public delete(id: number) {
    return prisma.paymentConfig.delete({ where: { id } });
  }
}

export default new PaymentConfigRepository();
