"use client";
import { Button } from "@/components/ui/button";
import accountService from "@/libs/services/account.service";
import { useUser } from "@/store/auth-store";
import { useModalActions } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { Mail, RectangleEllipsisIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function AdminAccountPage() {
  const user = useUser();
  const { openModal, closeModal } = useModalActions();

  const { mutate: requestChangeEmail } = useMutation({
    mutationFn: async (password: string) =>
      accountService.adminRequestChangeEmail(password),
    onSuccess: (data) => {
      toast.success(data.message);
      closeModal();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  return (
    <div className="flex flex-col gap-4">
      {/* Info */}
      <div className="flex gap-4">
        <div className="flex-1 gap-y-1">
          <p className="font-semibold opacity-50">Địa chỉ email:</p>
          <div className="p-2 bg-background rounded-md flex items-center w-full shadow-1 ring-1 ring-gray-300">
            {user?.email}
          </div>
        </div>
        <div className="min-w-1/5">
          <p className="font-semibold opacity-50">Phân quyền:</p>
          <div className="p-2 bg-background rounded-md flex items-center w-full shadow-sm ring-1 ring-gray-300">
            {user?.role.toUpperCase()}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="grid grid-cols-4 gap-2">
        <p className="col-span-4 font-semibold opacity-50">Cài đặt</p>
        <Button
          onClick={() =>
            openModal({
              type: "adminRequestChangeEmail",
              props: { onSubmit: (text) => requestChangeEmail(text) },
            })
          }
        >
          <Mail /> <span>Đổi email</span>
        </Button>
        <Button
          onClick={() => {
            openModal({ type: "adminRequestChangePassword", props: null });
          }}
        >
          <RectangleEllipsisIcon /> <span>Đổi mật khẩu</span>
        </Button>
      </div>
    </div>
  );
}

export default AdminAccountPage;
