export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export enum OrderStatus {
  PENDING = 1,
  PAID = 2,
  PROCESSING = 3,
  SHIPPING = 4,
  DONE = 5,
  CANCELED = 0,
}

export enum DeliveryType {
  SHOP = 1,
  POST = 2,
}

export enum HighlightType {
  NEW = "new",
  HOT = "hot",
  BEST_SELL = "bestsell",
}

export enum LocationType {
  PROVINCE = 1,
  DISTRICT = 2,
  WARD = 3,
}
