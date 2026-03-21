"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTE } from "@/constants/routes";
import accountService from "@/libs/services/account.service";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon, HomeIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function AdminConfirmChangePasswordForm() {
  const searchParams = useSearchParams();
  const { token, expiresAt } = {
    token: searchParams.get("token"),
    expiresAt: searchParams.get("expiresAt"),
  };
  if (!token || !expiresAt) {
    notFound();
  }
  const [done, setDone] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => accountService.adminConfirmChangePassword(token),
    onSuccess: (data) => {
      setDone(true);
      toast.success(data.message);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const isValid = new Date() < new Date(expiresAt);
  return (
    <div className="fixed inset-0 grid place-items-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl text-center">
            Xác nhận đổi mật khẩu
          </CardTitle>
          <CardDescription className="text-center">
            {isValid ? (
              <span>
                Bạn vừa thực hiện yêu cầu đổi mật khẩu.
                <br /> Ấn nút bên dưới để xác nhận thay đổi của bạn.
              </span>
            ) : (
              "Thao tác đã hết thời hạn, vui lòng gửi yêu cầu khác"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          {!isValid ? (
            <XCircleIcon className="text-red-400 size-9" />
          ) : done ? (
            <div className="flex flex-col space-y-4 items-center">
              <CheckCircle2Icon className="text-green-400 size-9" />
              <Button className="p-0">
                <Link
                  href={ROUTE.admin}
                  className="p-2 flex items-center gap-2 px-4"
                >
                  <HomeIcon /> Trang chủ
                </Link>
              </Button>
            </div>
          ) : (
            <Button onClick={() => mutate()} disabled={isPending}>
              Xác nhận thay đổi
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminConfirmChangePasswordForm;
