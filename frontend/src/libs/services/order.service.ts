import { DeliveryType, OrderStatus } from "@/constants/enums";
import apiAxios from "@/libs/api/api-axios";
import { OrderDetailSchema } from "@/libs/schemas/order-detail.schema";
import { OrderTimelineSchema } from "@/libs/schemas/order-timeline.schema";
import { OrderBaseSchema } from "@/libs/schemas/order.schema";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const orderService = {
  user: {
    create: (data: {
      deliveryType: DeliveryType;
      addressId?: number;
      products: { productId: number; quantity: number }[];
      receiverName?: string;
      receiverPhone?: string;
    }) =>
      axiosHandler(
        apiAxios.post("/v1/order", data),
        ApiResponseSchema(
          OrderBaseSchema.extend({
            details: z.array(OrderDetailSchema),
            timelines: z.array(OrderTimelineSchema),
          })
        )
      ),
    filter: (params: {
      status?: OrderStatus;
      from?: string;
      to?: string;
      page: number;
      limit: number;
      order: "create_asc" | "create_desc" | "update_asc" | "update_desc";
    }) => {
      return axiosHandler(
        apiAxios.get("/v1/order", {
          params: {
            status: params.status,
            from: params.from,
            to: params.to,
            page: params.page,
            limit: params.limit,
            order: params.order,
          },
        }),
        PaginatedResponseSchema(
          OrderBaseSchema.extend({
            details: z.array(OrderDetailSchema),
          })
        )
      );
    },
    getById: (id: number) =>
      axiosHandler(
        apiAxios.get(`/v1/order/${id}`),
        ApiResponseSchema(
          OrderBaseSchema.extend({
            details: z.array(OrderDetailSchema),
            timelines: z.array(OrderTimelineSchema),
          })
        )
      ),
  },
  admin: {},
};

export default orderService;
