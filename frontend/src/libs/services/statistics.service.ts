import { OrderStatus } from "@/constants/enums";
import apiAxios from "@/libs/api/api-axios";
import { AccountBaseSchema } from "@/libs/schemas/account.schema";
import { ProductBaseSchema } from "@/libs/schemas/product.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { UserBaseSchema } from "@/libs/schemas/user.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const statisticsService = {
  getBestSellingProducts: (opts?: {
    from?: Date;
    to?: Date;
    limit?: number;
    page?: number;
    sortBy?: "quantity" | "revenue" | "order";
  }) => {
    const searchParams = new URLSearchParams();
    if (opts?.from) searchParams.append("from", opts.from.toISOString());
    if (opts?.to) searchParams.append("to", opts.to.toISOString());
    if (opts?.limit) searchParams.append("limit", opts.limit.toString());
    if (opts?.page) searchParams.append("page", opts.page.toString());
    if (opts?.sortBy) searchParams.append("sortBy", opts.sortBy);
    return axiosHandler(
      apiAxios.get(
        "/v1/statistics/product/best-sellers?" + searchParams.toString()
      ),
      ApiResponseSchema(
        z.array(
          z.object({
            product: ProductBaseSchema.omit({ desc: true }),
            totalOrder: z.number(),
            totalQuantity: z.number(),
          })
        )
      )
    );
  },

  getOrderCountsByStatus: (opts?: { from: Date; to: Date }) => {
    const query = new URLSearchParams();
    if (opts?.from) query.append("from", opts.from.toISOString());
    if (opts?.to) query.append("to", opts.to.toISOString());
    return axiosHandler(
      apiAxios.get("/v1/statistics/order/by-status?" + query.toString()),
      ApiResponseSchema(
        z.array(
          z.object({
            status: z
              .number()
              .refine((val) => Object.values(OrderStatus).includes(val), {
                message: "Invalid order status",
              }),
            count: z.number(),
          })
        )
      )
    );
  },

  getOrderCountDaily: (opts: { from: Date; to: Date }) => {
    const query = new URLSearchParams();
    query.append("from", opts.from.toISOString());
    query.append("to", opts.to.toISOString());
    return axiosHandler(
      apiAxios.get("/v1/statistics/order/daily?" + query.toString()),
      ApiResponseSchema(
        z.array(
          z.object({
            from: z.string(),
            to: z.string(),
            count: z.number(),
          })
        )
      )
    );
  },

  getTopUsersByOrders: (opts?: {
    from?: Date;
    to?: Date;
    limit?: number;
    sortBy: "asc" | "desc";
  }) => {
    const searchParams = new URLSearchParams();
    if (opts?.from) searchParams.append("from", opts.from.toISOString());
    if (opts?.to) searchParams.append("to", opts.to.toISOString());
    if (opts?.limit) searchParams.append("limit", opts.limit.toString());
    if (opts?.sortBy) searchParams.append("sortBy", opts.sortBy);
    return axiosHandler(
      apiAxios.get("/v1/statistics/order/top-users?" + searchParams.toString()),
      ApiResponseSchema(
        z.array(
          z.object({
            user: UserBaseSchema.extend({ account: AccountBaseSchema }),
            orderCount: z.number(),
          })
        )
      )
    );
  },

  getUserCount: (opts?: { from?: Date; to?: Date; isActive?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (opts?.from) searchParams.append("from", opts.from.toISOString());
    if (opts?.to) searchParams.append("to", opts.to.toISOString());
    if (opts?.isActive !== undefined)
      searchParams.append("active", opts.isActive ? "1" : "0");

    return axiosHandler(
      apiAxios.get("/v1/statistics/user/count?" + searchParams.toString()),
      ApiResponseSchema(
        z.object({
          count: z.number(),
        })
      )
    );
  },
};

export default statisticsService;
