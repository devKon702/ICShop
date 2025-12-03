import { DeliveryType, OrderStatus } from "@/constants/enums";
import apiAxios from "@/libs/api/api-axios";
import { AccountBaseSchema } from "@/libs/schemas/account.schema";
import {
  OrderDetailSchema,
  SafeOrderDetailSchema,
} from "@/libs/schemas/order-detail.schema";
import { OrderTimelineBaseSchema } from "@/libs/schemas/order-timeline.schema";
import { OrderBaseSchema } from "@/libs/schemas/order.schema";
import {
  ProductBaseSchema,
  SafeProductBaseSchema,
} from "@/libs/schemas/product.schema";
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
            details: z.array(
              SafeOrderDetailSchema.extend({
                product: SafeProductBaseSchema.omit({ desc: true }),
              })
            ),
            timelines: z.array(OrderTimelineBaseSchema),
          })
        )
      ),
    cancel: (orderId: number, desc: string) => {
      return axiosHandler(
        apiAxios.patch(`/v1/order/${orderId}/cancel`, { desc }),
        ApiResponseSchema(
          OrderBaseSchema.extend({
            timelines: z.array(OrderTimelineBaseSchema),
          })
        )
      );
    },
    updateAddress: (
      orderId: number,
      data: {
        deliveryType: DeliveryType;
        addressId?: number;
        receiverName?: string;
        receiverPhone?: string;
      }
    ) => {
      return axiosHandler(
        apiAxios.patch(`/v1/order/${orderId}/address`, { ...data }),
        ApiResponseSchema(OrderBaseSchema)
      );
    },
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
      filter: {
        page: number;
        limit: number;
        sortBy: "asc" | "desc";
        status?: OrderStatus;
        from?: Date;
        to?: Date;
      }
    ) => {
      const query = new URLSearchParams();
      query.append("page", filter.page.toString());
      query.append("limit", filter.limit.toString());
      query.append("sortBy", filter.sortBy);
      if (filter.from) {
        query.append("from", filter.from.toISOString());
      }
      if (filter.to) {
        query.append("to", filter.to.toISOString());
      }
      if (filter.status !== undefined) {
        query.append("status", filter.status.toString());
      }
      return axiosHandler(
        apiAxios.get(`/v1/admin/order/user/${userId}?${query.toString()}`),
        PaginatedResponseSchema(
          OrderBaseSchema.extend({
            _count: z.object({ details: z.number() }),
          })
        )
      );
    },

    getByProductId: (
      productId: number,
      filter: {
        page: number;
        limit: number;
        sortBy: "asc" | "desc";
        status?: OrderStatus;
        from?: Date;
        to?: Date;
      }
    ) => {
      const query = new URLSearchParams();
      query.append("page", filter.page.toString());
      query.append("limit", filter.limit.toString());
      query.append("sortBy", filter.sortBy);
      if (filter.from) {
        query.append("from", filter.from.toISOString());
      }
      if (filter.to) {
        query.append("to", filter.to.toISOString());
      }
      if (filter.status !== undefined) {
        query.append("status", filter.status.toString());
      }
      return axiosHandler(
        apiAxios.get(
          `/v1/admin/order/product/${productId}?${query.toString()}`
        ),
        PaginatedResponseSchema(
          OrderBaseSchema.extend({
            user: UserBaseSchema.extend({
              account: AccountBaseSchema,
            }),
          })
        )
      );
    },
  },
};

export default orderService;
