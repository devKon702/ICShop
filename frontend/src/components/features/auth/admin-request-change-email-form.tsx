import AdminCheckPasswordForm from "@/components/features/auth/admin-check-password-form";
import accountService from "@/libs/services/account.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

function AdminRequestChangeEmailForm() {
  const { closeModal } = useModalActions();
  const { mutate: requestChangeEmail, isPending } = useMutation({
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
    <AdminCheckPasswordForm
      onSubmit={requestChangeEmail}
      submitting={isPending}
    />
  );
}

export default AdminRequestChangeEmailForm;
