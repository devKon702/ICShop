"use client";
import { Button } from "@/components/ui/button";
import accountService from "@/libs/services/account.service";
import { useMutation } from "@tanstack/react-query";
import { Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  token: string;
}
function AdminLockAccountForm({ token }: Props) {
  const [done, setDone] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => accountService.adminLockAccount(token),
    onSuccess: (data) => {
      setDone(true);
      toast.success(data.message);
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="flex flex-col space-y-2 items-center">
      {done ? (
        <>
          <ShieldCheck className="size-10 text-green-400" />
          <p className="font-semibold opacity-50">
            Đã khóa tài khoản thành công
          </p>
        </>
      ) : (
        <>
          <ShieldAlert className="size-10" />
          <p className="font-semibold opacity-50 text-center">
            Có vẻ bạn đang gặp vấn đề về bảo mật tài khoản, hãy nhanh chóng khóa
            tài khoản của bạn.
          </p>
          <Button onClick={() => mutate()} disabled={isPending}>
            <Lock />
            <span>Khóa</span>
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminLockAccountForm;
