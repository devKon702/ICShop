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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/className";

type User = {
  id: number;
  email: string;
  displayName: string;
  orderCount: number;
  isActive: boolean;
};

const MOCK_USERS: User[] = Array.from({ length: 67 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  displayName: `Người dùng ${i + 1}`,
  orderCount: Math.floor(Math.random() * 30),
  isActive: i % 3 !== 0, // Một số user bị khóa
}));

const STATUS_FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Đã khoá", value: "inactive" },
];

export default function AdminUserPage() {
  const [filters, setFilters] = useState({
    searchEmail: "",
    searchName: "",
    status: "",
    sort: "desc", // hoặc "asc"
  });

  const [users, setUsers] = useState(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchEmail = user.email
          .toLowerCase()
          .includes(filters.searchEmail.toLowerCase());
        const matchName = user.displayName
          .toLowerCase()
          .includes(filters.searchName.toLowerCase());
        const matchStatus =
          filters.status === ""
            ? true
            : filters.status === "active"
            ? user.isActive
            : !user.isActive;
        return matchEmail && matchName && matchStatus;
      })
      .sort((a, b) =>
        filters.sort === "desc"
          ? b.orderCount - a.orderCount
          : a.orderCount - b.orderCount
      );
  }, [filters, users]);

  const totalPage = Math.ceil(filteredUsers.length / perPage);
  const paginated = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleToggleStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <input
          className="border px-2 py-1 rounded-md"
          placeholder="Tìm theo email"
          value={filters.searchEmail}
          onChange={(e) =>
            setFilters({ ...filters, searchEmail: e.target.value })
          }
        />
        <input
          className="border px-2 py-1 rounded-md"
          placeholder="Tìm theo tên"
          value={filters.searchName}
          onChange={(e) =>
            setFilters({ ...filters, searchName: e.target.value })
          }
        />
        <Select
          value={filters.status}
          onValueChange={(val) => setFilters({ ...filters, status: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sort}
          onValueChange={(val) => setFilters({ ...filters, sort: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sắp xếp theo đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Nhiều đơn nhất</SelectItem>
            <SelectItem value="asc">Ít đơn nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Tên hiển thị</TableHead>
            <TableHead>Số đơn hàng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>{user.orderCount}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-sm font-medium",
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {user.isActive ? "Đang hoạt động" : "Đã khoá"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.isActive ? "Khoá" : "Mở khoá"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Không tìm thấy người dùng.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPage }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
