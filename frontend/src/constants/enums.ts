export enum ROLE {
  USER = "user",
  ADMIN = "admin",
}

export enum DeliveryType {
  SHOP = 1,
  POST = 2,
}

export enum OrderStatus {
  PENDING = 1,
  PAID = 2,
  PROCESSING = 3,
  SHIPPING = 4,
  DONE = 5,
  CANCELED = 0,
}

export enum HighlightType {
  NEW = "new",
  HOT = "hot",
  BEST_SELL = "bestsell",
}
