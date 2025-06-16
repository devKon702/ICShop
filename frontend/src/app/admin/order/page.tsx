"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { format } from "date-fns";
import { cn } from "@/utils/className"; // Nếu bạn dùng Tailwind helper của shadcn
import { Info } from "lucide-react";

type Order = {
  id: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  orderStatus: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"];

const MOCK_ORDERS: Order[] = Array.from({ length: 57 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  receiverName: ["Nam", "Linh", "An", "Tùng"][i % 4],
  receiverPhone: `0900${i}`,
  address: `Số ${i} - Quận ${i % 10}`,
  orderStatus: STATUS_OPTIONS[i % STATUS_OPTIONS.length],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

function getStatusColor(status: string) {
  switch (status) {
    case "Đang xử lý":
      return "bg-yellow-100 text-yellow-700";
    case "Đang giao":
      return "bg-blue-100 text-blue-700";
    case "Đã giao":
      return "bg-green-100 text-green-700";
    case "Đã hủy":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminOrderPage() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchId: "",
    searchName: "",
    status: "",
    date: "",
  });

  const [orders, setOrders] = useState(MOCK_ORDERS);

  const perPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchId = order.id
        .toLowerCase()
        .includes(filters.searchId.toLowerCase());
      const matchName = order.receiverName
        .toLowerCase()
        .includes(filters.searchName.toLowerCase());
      const matchStatus = filters.status
        ? order.orderStatus === filters.status
        : true;
      const matchDate = filters.date
        ? order.createdAt.slice(0, 10) === filters.date
        : true;

      return matchId && matchName && matchStatus && matchDate;
    });
  }, [filters, orders]);

  const totalPage = Math.ceil(filteredOrders.length / perPage);
  const paginated = filteredOrders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleChangeStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const handleViewDetail = (orderId: string) => {
    // Giả lập dữ liệu chi tiết (bạn nên gọi API trong thực tế)
    const detail = {
      id: orderId,
      userId: 1,
      orderStatusId: 2,
      address: "Số 1, Quận 1, TP.HCM",
      receiverName: "Nguyễn Văn A",
      receiverPhone: "0909123456",
      deliveryTypeId: "FAST",
      vat: 10000,
      deliveryFee: 20000,
      earliestReceiveTime: "2025-06-01T08:00:00Z",
      latestReceiveTime: "2025-06-01T17:00:00Z",
      createdAt: "2025-05-30T12:00:00Z",
      updatedAt: "2025-06-01T13:00:00Z",
      user: { id: 1, name: "Nguyễn Văn A", email: "a@example.com" },
      orderStatus: { id: 2, name: "Đang giao" },
      deliveryType: { id: "FAST", name: "Qua bưu điện" },
      details: [
        {
          productId: 1,
          productName: "Vi mạch ESP8266",
          quantity: 2,
          price: 150000,
        },
        {
          productId: 2,
          productName: "Arduino Rasperry",
          quantity: 1,
          price: 300000,
        },
      ],
      timelines: [
        {
          time: "2025-05-30T12:00:00Z",
          status: "Đã đặt hàng",
        },
        {
          time: "2025-06-01T08:00:00Z",
          status: "Đang giao",
        },
      ],
    };
    setSelectedOrder(detail);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          className="border px-2 rounded-md"
          placeholder="Tìm theo mã đơn hàng"
          value={filters.searchId}
          onChange={(e) => setFilters({ ...filters, searchId: e.target.value })}
        />
        <input
          className="border px-2 rounded-md"
          placeholder="Tìm theo tên người nhận"
          value={filters.searchName}
          onChange={(e) =>
            setFilters({ ...filters, searchName: e.target.value })
          }
        />
        <Select
          onValueChange={(val) => setFilters({ ...filters, status: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái đơn" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          className="border px-2 rounded-md"
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      {/* Bảng đơn hàng */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Người nhận</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.receiverName}</TableCell>
                <TableCell>{order.receiverPhone}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>
                  <Select
                    value={order.orderStatus}
                    onValueChange={(val) => handleChangeStatus(order.id, val)}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-[140px] cursor-pointer",
                        getStatusColor(order.orderStatus)
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <button
                    // variant="outline"
                    onClick={() => handleViewDetail("ORD-1")}
                    className="flex justify-center items-center cursor-pointer"
                  >
                    <Info />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Không tìm thấy đơn hàng.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {[...Array(totalPage)].map((_, i) => {
            const page = i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {selectedOrder && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng: {selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 app max-h-96 overflow-y-auto">
              <p>
                <strong>Người nhận:</strong> {selectedOrder.receiverName} (
                {selectedOrder.receiverPhone})
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedOrder.orderStatus?.name}
              </p>
              <p>
                <strong>Hình thức giao:</strong>{" "}
                {selectedOrder.deliveryType?.name}
              </p>
              <p>
                <strong>VAT:</strong> {selectedOrder.vat.toLocaleString()}đ
              </p>
              <p>
                <strong>Phí giao hàng:</strong>{" "}
                {selectedOrder.deliveryFee.toLocaleString()}đ
              </p>
              <p>
                <strong>Thời gian nhận sớm nhất:</strong>{" "}
                {format(
                  new Date(selectedOrder.earliestReceiveTime),
                  "dd/MM/yyyy HH:mm"
                )}
              </p>
              <p>
                <strong>Thời gian nhận trễ nhất:</strong>{" "}
                {format(
                  new Date(selectedOrder.latestReceiveTime),
                  "dd/MM/yyyy HH:mm"
                )}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {format(new Date(selectedOrder.createdAt), "dd/MM/yyyy HH:mm")}
              </p>
              <p>
                <strong>Ngày cập nhật:</strong>{" "}
                {format(new Date(selectedOrder.updatedAt), "dd/MM/yyyy HH:mm")}
              </p>

              <div>
                <strong>Sản phẩm:</strong>
                <ul className="list-disc pl-6">
                  {selectedOrder.details.map((item: any, index: number) => (
                    <li key={index}>
                      {item.productName} - SL: {item.quantity} - Giá:{" "}
                      {item.price.toLocaleString()}đ
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Lịch sử trạng thái:</strong>
                <ul className="list-disc pl-6">
                  {selectedOrder.timelines.map((item: any, index: number) => (
                    <li key={index}>
                      {format(new Date(item.time), "dd/MM/yyyy HH:mm")} -{" "}
                      {item.status}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
