import { HighlightType, OrderStatus } from "@/constants/enums";

export const ORDER_STATUS_OPTIONS = [
  {
    value: OrderStatus.CANCELED,
    label: "Đã hủy",
    color: "bg-red-100 text-red-500 bg-red-500/10",
  },
  {
    value: OrderStatus.PENDING,
    label: "Chờ xác nhận",
    color: "bg-gray-100 text-gray-500 bg-gray-500/10",
  },
  {
    value: OrderStatus.PAID,
    label: "Đã thanh toán",
    color: "bg-yellow-100 text-yellow-500 bg-yellow-500/10",
  },
  {
    value: OrderStatus.PROCESSING,
    label: "Đang xử lí",
    color: "bg-blue-100 text-blue-500 bg-blue-500/10",
  },
  {
    value: OrderStatus.SHIPPING,
    label: "Đang giao",
    color: "bg-indigo-100 text-indigo-500 bg-indigo-500/10",
  },
  {
    value: OrderStatus.DONE,
    label: "Hoàn thành",
    color: "bg-green-100 text-green-500 bg-green-500/10",
  },
] as const;

export const HIGHLIGHT_OPTIONS = [
  { value: HighlightType.BEST_SELL, label: "Bán chạy" },
  { value: HighlightType.HOT, label: "Nổi bật" },
  { value: HighlightType.NEW, label: "Mới thêm" },
] as const;
