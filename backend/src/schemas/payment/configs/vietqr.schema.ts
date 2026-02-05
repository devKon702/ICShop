import { z } from "zod";
import { PaymentType } from "../../../constants/payment";

export const VietQrPublicConfigSchema = z.object({
  type: z.literal(PaymentType.VietQR),
  description: z.string().max(500).optional(),
  bankName: z.string(),
  bankCode: z.string(),
  accountNumber: z.string(),
  accountHolderName: z.string(),
});

export const VietQrPrivateConfigSchema = z.object({
  type: z.literal(PaymentType.VietQR),
});
