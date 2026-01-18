import { z } from "zod";

export const VietQrPublicConfigSchema = z.object({
  type: z.literal("VietQR"),
  description: z.string().max(500).optional(),
  bankName: z.string(),
  bankCode: z.string(),
  accountNumber: z.string(),
  accountHolderName: z.string(),
});

export const VietQrPrivateConfigSchema = z.object({
  type: z.literal("VietQR"),
});
