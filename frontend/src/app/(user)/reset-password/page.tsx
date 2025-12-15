import ResetPasswordForm from "@/components/features/auth/reset-password-form";
import React from "react";

interface Props {
  searchParams: {
    email: string;
    token: string;
  };
}

export default function ResetPasswordPage({ searchParams }: Props) {
  const { email, token } = searchParams;

  return (
    <div className="w-full min-h-[70dvh] bg-white rounded-md p-6 grid place-items-center">
      <div className="flex flex-col space-y-4 w-[40dvw]">
        <h1 className="text-2xl font-semibold">Đặt lại mật khẩu</h1>
        <ResetPasswordForm email={email} token={token} />
      </div>
    </div>
  );
}
