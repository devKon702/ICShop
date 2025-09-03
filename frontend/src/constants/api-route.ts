import { ENV_API_ORIGIN } from "@/constants/env";

const base = ENV_API_ORIGIN + "/api/v1";

export const API_ROUTE = {
  auth: base + "/auth",
  account: base + "/account",
  product: base + "/product",
  category: base + "/category",
  order: base + "/order",
  cart: base + "/cart",
  address: base + "/address",
};
