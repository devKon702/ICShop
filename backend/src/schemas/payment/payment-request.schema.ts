import { z } from "zod";
import { idStringSchema, requestSchema } from "../shared.schema";
import { PaymentType } from "../../constants/payment";
import { Environment } from "@prisma/client";
import {
  PaymentPrivateConfigSchemas,
  PaymentPublicConfigSchemas,
} from "./configs/payment.schema";

export const createPaymentMethodSchema = requestSchema({
  body: z.object({
    code: z.nativeEnum(PaymentType, {
      message: "Loại phương thức thanh toán không hợp lệ",
    }),
    name: z.string().trim().nonempty(),
    desc: z.string().trim(),
    isActive: z.boolean().default(true),
    position: z.number().default(1),
  }),
});

export const updatePaymentMethodSchema = requestSchema({
  params: z.object({ id: idStringSchema }),
  body: z.object({
    code: z.nativeEnum(PaymentType, {
      message: "Loại phương thức thanh toán không hợp lệ",
    }),
    name: z.string().trim().nonempty(),
    desc: z.string().trim(),
    isActive: z.boolean(),
    position: z.number(),
  }),
});

export const createPaymentConfigSchema = requestSchema({
  body: z.object({
    paymentMethodId: z.number().min(1, "ID không hợp lệ"),
    environment: z.enum([Environment.production, Environment.sandbox], {
      message: "Môi trường cấu hình không hợp lệ",
    }),
    publicConfig: PaymentPublicConfigSchemas,
    privateConfig: PaymentPrivateConfigSchemas,
    isActive: z.boolean().default(true),
  }),
});

export const updatePaymentConfigSchema = requestSchema({
  params: z.object({ id: idStringSchema }),
  body: z.object({
    environment: z.enum([Environment.production, Environment.sandbox], {
      message: "Môi trường cấu hình không hợp lệ",
    }),
    publicConfig: PaymentPublicConfigSchemas,
    privateConfig: PaymentPrivateConfigSchemas,
    isActive: z.boolean(),
  }),
});
