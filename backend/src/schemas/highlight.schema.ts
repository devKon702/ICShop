import { z } from "zod";
import { HighlightType } from "../constants/db";
import { brotliDecompress } from "zlib";

export const createHighlightSchema = z.object({
  body: z.object({
    productId: z.number(),
    highlightType: z.enum([
      HighlightType.NEW,
      HighlightType.BEST_SELL,
      HighlightType.HOT,
    ]),
  }),
});

export const deleteHighlightSchema = z.object({
  params: z.object({ id: z.coerce.number().min(1, "ID không hợp lệ") }),
});

export const updateHighlightPositionSchema = z.object({
  body: z.object({
    data: z.array(
      z.object({
        id: z.number(),
        position: z.number().min(0, "Vị trí là số dương"),
      })
    ),
  }),
});
