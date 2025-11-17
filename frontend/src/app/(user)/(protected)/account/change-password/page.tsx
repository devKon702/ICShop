"use client";
import SetBreadCrump from "@/components/common/set-breadcrump";
import ChangePasswordForm from "@/components/features/auth/change-password-form";
import React from "react";

export default function ChangePasswordPage() {
  return (
    <div>
      <SetBreadCrump
        breadcrumps={[
          { label: "Trang chủ", href: "/" },
          { label: "Đổi mật khẩu", href: "/account/change-password" },
        ]}
      />
      <h1 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h1>
      <ChangePasswordForm />
    </div>
  );
}
