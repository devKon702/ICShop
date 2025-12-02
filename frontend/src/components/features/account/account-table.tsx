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
import { cn } from "@/utils/className";
import { Button } from "@/components/ui/button";
import { formatIsoDateTime } from "@/utils/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import accountService from "@/libs/services/account.service";
import { toast } from "sonner";
import { Lock, LockOpen, SquareMenu } from "lucide-react";
import { useModalActions } from "@/store/modal-store";
import MailLink from "@/components/common/mail-link";
import ZaloLink from "@/components/common/zalo-link";
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
  const { openModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: { accountId: number; isActive: boolean }) =>
      accountService.changeStatus({
        accountId: data.accountId,
        isActive: data.isActive,
      }),
    onSuccess: (data) => {
      toast.success(
        `${data.data.isActive ? "Mở khóa" : "Khóa"} tài khoản ${
          data.data.email
        } thành công.`
      );
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (e) => {
      toast.error(e.message || "Thay đổi trạng thái tài khoản thất bại.");
    },
  });
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
                  src={account.user.avatarUrl ?? undefined}
                  appFileBase
                  avatarPlaceholderName={account.user.name}
                  width={50}
                  height={50}
                  className="w-10 h-10 rounded-full"
                  alt={account.user.name}
                />
              </TableCell>
              <TableCell>
                <MailLink
                  email={account.email}
                  className="hover:underline cursor-pointer"
                  title={`Mail: ${account.email}`}
                  target="_blank"
                >
                  {account.email}
                </MailLink>
              </TableCell>
              <TableCell>{account.user.name}</TableCell>
              <TableCell>
                {account.user.phone ? (
                  <ZaloLink
                    phone={account.user.phone}
                    className="hover:underline cursor-pointer"
                    title={`Zalo: ${account.user.phone}`}
                    target="_blank"
                  >
                    {account.user.phone}
                  </ZaloLink>
                ) : (
                  "-"
                )}
              </TableCell>
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
                  {account.isActive ? "Hoạt động" : "Khoá"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    title={
                      account.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"
                    }
                    onClick={() => {
                      if (
                        confirm(
                          `Bạn có chắc muốn ${
                            account.isActive ? "khóa" : "mở khóa"
                          } tài khoản ${account.email} không?`
                        )
                      ) {
                        mutate({
                          accountId: account.id,
                          isActive: !account.isActive,
                        });
                      }
                    }}
                  >
                    {account.isActive ? <Lock /> : <LockOpen />}
                  </Button>
                  <Button
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                    size="sm"
                    title="Các đơn hàng đã đặt"
                    onClick={() => {
                      openModal({
                        type: "userOrders",
                        props: {
                          user: {
                            id: account.id,
                            name: account.user.name,
                            email: account.email,
                            phone: account.user.phone,
                            avatarUrl: account.user.avatarUrl,
                          },
                        },
                      });
                    }}
                  >
                    <SquareMenu />
                  </Button>
                </div>
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
