import { DeliveryType, OrderStatus } from "@/constants/enums";
import apiAxios from "@/libs/api/api-axios";
import { OrderDetailSchema } from "@/libs/schemas/order-detail.schema";
import { OrderTimelineBaseSchema } from "@/libs/schemas/order-timeline.schema";
import { OrderBaseSchema } from "@/libs/schemas/order.schema";
import { ProductBaseSchema } from "@/libs/schemas/product.schema";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
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
            timelines: z.array(OrderTimelineBaseSchema),
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
            timelines: z.array(OrderTimelineBaseSchema),
          })
        )
      ),
  },
  admin: {
    filter: (params: {
      status?: OrderStatus;
      from?: string;
      to?: string;
      page: number;
      limit: number;
      sortBy: "create_asc" | "create_desc" | "update_asc" | "update_desc";
      receiverPhone?: string;
      email?: string;
      code?: string;
      isActive?: boolean;
    }) => {
      return axiosHandler(
        apiAxios.get("/v1/admin/order", {
          params: {
            status: params.status,
            from: params.from,
            to: params.to,
            page: params.page,
            limit: params.limit,
            sortBy: params.sortBy,
            receiverPhone: params.receiverPhone,
            email: params.email,
            code: params.code,
            isActive: params.isActive,
          },
        }),
        PaginatedResponseSchema(
          OrderBaseSchema.extend({
            user: UserBaseSchema.extend({
              account: z.object({ email: z.string() }),
            }),
          })
        )
      );
    },
    getById: (id: number) =>
      axiosHandler(
        apiAxios.get(`/v1/admin/order/${id}`),
        ApiResponseSchema(
          OrderBaseSchema.extend({
            user: UserBaseSchema.extend({
              account: z.object({ email: z.string() }),
            }),
            creator: UserBaseSchema.extend({
              account: z.object({ email: z.string() }),
            }),
            details: z.array(
              OrderDetailSchema.extend({
                product: ProductBaseSchema.omit({ desc: true }),
              })
            ),
            timelines: z.array(
              OrderTimelineBaseSchema.extend({
                creator: UserBaseSchema.extend({
                  account: z.object({ email: z.string() }),
                }),
              })
            ),
          })
        )
      ),

    changeStatus: (data: {
      status: OrderStatus;
      desc: string;
      orderId: number;
    }) =>
      axiosHandler(
        apiAxios.post(`/v1/admin/order/timeline`, data),
        ApiResponseSchema(
          OrderBaseSchema.extend({
            timelines: z.array(OrderTimelineBaseSchema),
          })
        )
      ),

    getByUserId: (
      userId: number,
      filter: { page: number; limit: number; sortBy: "asc" | "desc" }
    ) => {
      const query = new URLSearchParams();
      query.append("page", filter.page.toString());
      query.append("limit", filter.limit.toString());
      query.append("sortBy", filter.sortBy);
      return axiosHandler(
        apiAxios.get(`/v1/admin/order/user/${userId}?${query.toString()}`),
        PaginatedResponseSchema(
          OrderBaseSchema.extend({
            _count: z.object({ details: z.number() }),
          })
        )
      );
    },
  },
};

export default orderService;
