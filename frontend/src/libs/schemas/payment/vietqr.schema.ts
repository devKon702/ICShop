import { PaymentType } from "@/constants/enums";
import { z } from "zod";

export const VietQrPublicConfigSchema = z.object({
  type: z.literal(PaymentType.VietQR),
  description: z.string().max(500),
  bankName: z.string(),
  bankCode: z.string(),
  accountNumber: z.string(),
  accountHolderName: z.string(),
});

export const VietQrPrivateConfigSchema = z.object({
  type: z.literal(PaymentType.VietQR),
});
