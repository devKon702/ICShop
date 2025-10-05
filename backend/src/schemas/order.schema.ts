import { z } from "zod";
import { phoneRegex, vietnameseRegex } from "../utils/regex";
import { DeliveryType, OrderStatus } from "../constants/db";
import { ppid } from "process";
import { idStringSchema } from "./shared.schema";
import orderController from "../controllers/order.controller";

export const createOrderSchema = z.object({
  body: z
    .object({
      deliveryType: z
        .number()
        .refine(
          (val) => [DeliveryType.SHOP, DeliveryType.POST].includes(val),
          "Loại giao hàng không hợp lệ"
        ),
      addressId: idStringSchema.optional(),
      receiverName: z
        .string()
        .regex(vietnameseRegex(), "Tên không hợp lệ")
        .optional(),
      receiverPhone: z
        .string()
        .regex(phoneRegex(), "Số điện thoại không hợp lệ")
        .optional(),
      products: z.array(
        z.object({
          productId: z.number(),
          quantity: z
            .number()
            .int("Phải là kiểu số nguyên")
            .min(1, "Số lượng tối thiểu là 1"),
        })
      ),
    })
    .refine((data) => {
      if (data.deliveryType === DeliveryType.POST) return !!data.addressId;
      return true;
    }, "Địa chỉ giao hàng là bắt buộc")
    .refine((data) => {
      if (data.deliveryType === DeliveryType.SHOP)
        return data.receiverName && data.receiverPhone;
      return true;
    }, "Tên và số điện thoại người nhận là bắt buộc"),
});

export const getMyOrderSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
    status: z.coerce
      .number()
      .refine(
        (val) => Object.values(OrderStatus).includes(val),
        "Trạng thái đơn hàng không hợp lệ"
      )
      .optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    order: z
      .enum(["create_asc", "create_desc", "update_asc", "update_desc"])
      .default("create_desc"),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
});

export const cancleOrderSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
  body: z.object({
    desc: z.string(),
  }),
});

export const seenOrderTimelineSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
});

export const createOrderTimelineSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
  body: z.object({
    status: z
      .number()
      .refine(
        (val) => Object.values(OrderStatus).includes(val),
        "Trạng thái đơn hàng không hợp lệ"
      ),
    desc: z.string(),
  }),
});

export const updateTimelineDescSchema = z.object({
  params: z.object({
    id: z.coerce.number().min(1, "ID không hợp lệ"),
  }),
  body: z.object({
    desc: z.string(),
  }),
});

export const filterOrderSchema = z.object({
  query: z.object({
    code: z.string().optional(),
    status: z
      .number()
      .refine((val) => Object.values(OrderStatus).includes(val))
      .optional(),
    isActive: z.enum(["0", "1"]).transform((val) => !!Number(val)),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
    order: z
      .enum(["create_asc", "create_desc", "update_asc", "update_desc"])
      .default("create_desc"),
  }),
});
