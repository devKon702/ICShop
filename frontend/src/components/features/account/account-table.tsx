import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SafeImage from "@/components/common/safe-image";
import env from "@/constants/env";
import { cn } from "@/utils/className";
import { Button } from "@/components/ui/button";
import { formatIsoDateTime } from "@/utils/date";

interface Props {
  accounts: {
    id: number;
    email: string;
    createdAt: Date;
    user: {
      id: number;
      name: string;
      phone: string | null;
      avatarUrl: string | null;
    };
    isActive: boolean;
  }[];
}

export default function AccountTable({ accounts }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tên hiển thị</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <SafeImage
                  src={
                    account.user.avatarUrl
                      ? env.NEXT_PUBLIC_FILE_URL + account.user.avatarUrl
                      : "https://ui-avatars.com/api/?name=" + account.user.name
                  }
                  width={50}
                  height={50}
                  className="w-10 h-10 rounded-full"
                  alt={account.user.name}
                />
              </TableCell>
              <TableCell>{account.email}</TableCell>
              <TableCell>{account.user.name}</TableCell>
              <TableCell>{account.user.phone || "-"}</TableCell>
              <TableCell>{formatIsoDateTime(account.createdAt)}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-sm font-medium",
                    account.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {account.isActive ? "Đang hoạt động" : "Đã khoá"}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  {account.isActive ? "Khoá" : "Mở khoá"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Không có tài khoản nào.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
