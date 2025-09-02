import { z } from "zod";
import { phoneRegex, vietnameseRegex } from "../utils/regex";
import { DeliveryType, OrderStatus } from "../constants/db";
import { ppid } from "process";

export const createOrderSchema = z.object({
  body: z.object({
    receiverName: z
      .string()
      .regex(
        vietnameseRegex(false),
        "Tên người nhận chỉ bao gồm chữ cái và khoảng trắng"
      ),
    receiverPhone: z.string().regex(phoneRegex(), "Số diện thoại không hợp lệ"),
    deliveryType: z
      .number()
      .refine(
        (val) => Object.values(DeliveryType).includes(val),
        "Giá trị kiểu vận chuyển không hợp lệ"
      ),
    province: z.string(),
    district: z.string(),
    commune: z.string(),
    detail: z.string(),
    products: z.array(
      z.object({
        productId: z.number(),
        quantity: z
          .number()
          .int("Phải là kiểu số nguyên")
          .min(1, "Số lượng tối thiểu là 1"),
      })
    ),
  }),
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
    from: z.string().default(""),
    to: z.string().default(""),
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
