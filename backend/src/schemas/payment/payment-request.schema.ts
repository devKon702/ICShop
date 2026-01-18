import { z } from "zod";
import {
  VietQrPrivateConfigSchema,
  VietQrPublicConfigSchema,
} from "./vietqr.schema";

export const PaymentPublicConfigSchemas = z.discriminatedUnion("type", [
  VietQrPublicConfigSchema,
]);

export const PaymentPrivateConfigSchemas = z.discriminatedUnion("type", [
  VietQrPrivateConfigSchema,
]);


