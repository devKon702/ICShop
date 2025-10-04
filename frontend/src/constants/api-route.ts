import env from "@/constants/env";

const base = env.NEXT_PUBLIC_API_URL + "/v1";

export const API_ROUTE = {
  auth: base + "/auth",
  account: base + "/account",
  product: base + "/product",
  category: base + "/category",
  order: base + "/order",
  cart: base + "/cart",
  address: base + "/address",
} as const;
