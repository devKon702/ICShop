import { PaymentEnvironment, PaymentType } from "@/constants/enums";
import {
  VietQrPrivateConfigSchema,
  VietQrPublicConfigSchema,
} from "@/libs/schemas/payment/vietqr.schema";
import {
  DateTimeSchema,
  ID,
  Text,
  TinyText,
  UnsignedInt,
  UnsignedTinyInt,
} from "@/libs/schemas/shared.schema";
import { z } from "zod";

export const PaymentMethodSchema = z.object({
  id: ID,
  code: z.nativeEnum(PaymentType),
  name: TinyText,
  desc: Text,
  position: UnsignedTinyInt,
  isActive: z.boolean(),

  version: UnsignedInt,
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafePaymentMethodSchema = PaymentMethodSchema.pick({
  id: true,
  code: true,
  name: true,
  desc: true,
  position: true,
});

export const PaymentPublicConfigSchema = z.discriminatedUnion("type", [
  VietQrPublicConfigSchema,
]);
export const PaymentPrivateConfigSchema = z.discriminatedUnion("type", [
  VietQrPrivateConfigSchema,
]);

export const PaymentConfigSchema = z.object({
  id: ID,
  paymentMethodId: UnsignedInt,
  environment: z.enum([
    PaymentEnvironment.SANDBOX,
    PaymentEnvironment.PRODUCTION,
  ]),
  publicConfig: PaymentPublicConfigSchema,
  privateConfig: PaymentPrivateConfigSchema,
  isActive: z.boolean(),

  version: UnsignedInt,
  creatorId: UnsignedInt,
  modifierId: UnsignedInt,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const SafePaymentConfigSchema = PaymentConfigSchema.pick({
  id: true,
  paymentMethodId: true,
  publicConfig: true,
});
