import { Environment } from "@prisma/client";
import { env } from "../constants/env";
import paymentMethodRepository from "../repositories/payment-method.repository";
import { findByIdSchema } from "../schemas/shared.schema";
import { NotFoundError } from "../errors/not-found.error";
import { PaymentResponseCode } from "../constants/codes/payment.code";
import { HttpStatus } from "../constants/http-status";
import { successResponse } from "../utils/response";
import { sanitize } from "dompurify";
import { sanitizeData } from "../utils/sanitize";
import { Role } from "../constants/db";
import {
  PaymentPrivateConfigSchemas,
  PaymentPublicConfigSchemas,
} from "../schemas/payment";
import { z } from "zod";
import { AppError } from "../errors/app.error";
import paymentConfigRepository from "../repositories/payment-config.repository";

class PaymentService {
  public async getPayments() {
    const payments = await paymentMethodRepository.findMany({
      isActive: true,
      environment:
        env.NODE_ENV === "production" ? Environment.production : undefined,
    });
    return payments;
  }

  public async adminGetPayments() {
    const payments = await paymentMethodRepository.findMany();
    return payments;
  }

  public async getPaymentDetail(id: number, role: Role) {
    const paymentMethod = await paymentMethodRepository.findById(id, {
      includeConfig: true,
      isActive: role === Role.USER ? true : undefined,
      environment:
        env.NODE_ENV === "production" ? Environment.production : undefined,
    });
    if (!paymentMethod) {
      throw new NotFoundError(
        PaymentResponseCode.NOT_FOUND,
        "Không tìm thấy phương thức thanh toán",
      );
    }
    return paymentMethod;
  }

  public async createPaymentMethod(data: {
    code: string;
    name: string;
    desc: string;
    isActive: boolean;
    position: number;
    creatorId: number;
  }) {
    const created = await paymentMethodRepository.create(data);
    return created;
  }

  public async updatePaymentMehtod(
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
    const updated = await paymentMethodRepository.update(id, { ...data });
    return updated;
  }

  public async deletePaymentMethod(id: number) {
    const deleted = await paymentMethodRepository.delete(id);
    return deleted;
  }

  public async createPaymentConfig(data: {
    paymentMethodId: number;
    environment: Environment;
    publicConfig: z.infer<typeof PaymentPublicConfigSchemas>;
    privateConfig: z.infer<typeof PaymentPrivateConfigSchemas>;
    isActive: boolean;
    creatorId: number;
  }) {
    const method = await paymentMethodRepository.findById(data.paymentMethodId);
    // Check exist
    if (!method) throw new NotFoundError(PaymentResponseCode.NOT_FOUND);
    // Check valid config for payment method
    if (method.code !== data.publicConfig.type) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        PaymentResponseCode.PUBLIC_CONFIG_INVALID,
        "Loại cấu hình không khớp với phương thức thanh toán",
        true,
      );
    }
    if (method.code !== data.privateConfig.type) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        PaymentResponseCode.PRIVATE_CONFIG_INVALID,
        "Loại cấu hình không khớp với phương thức thanh toán",
        true,
      );
    }

    const createdConfig = await paymentConfigRepository.create({
      environment: data.environment,
      creatorId: data.creatorId,
      paymentMethodId: data.paymentMethodId,
      isActive: data.isActive,
      privateConfig: JSON.stringify(data.privateConfig),
      publicConfig: JSON.stringify(data.publicConfig),
    });
    return createdConfig;
  }

  public async updatePaymentConfig(
    id: number,
    data: {
      environment: Environment;
      publicConfig: z.infer<typeof PaymentPublicConfigSchemas>;
      privateConfig: z.infer<typeof PaymentPrivateConfigSchemas>;
      isActive: boolean;
      modifierId: number;
    },
  ) {
    const config = await paymentConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError(
        PaymentResponseCode.CONFIG_NOT_FOUND,
        "Không tìm thấy cáu hình",
      );
    }

    const udpated = await paymentConfigRepository.update(id, {
      environment: data.environment,
      isActive: data.isActive,
      modifierId: data.modifierId,
      publicConfig: JSON.stringify(data.publicConfig),
      privateConfig: JSON.stringify(data.privateConfig),
    });

    return udpated;
  }

  public async deletePaymentConfig(id: number) {
    const deleted = await paymentConfigRepository.delete(id);
    return deleted;
  }
}

export default new PaymentService();
