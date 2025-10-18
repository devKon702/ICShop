import SetBreadCrump from "@/components/common/set-breadcrump";
import AccountForm from "@/components/features/account/account-form";
import React from "react";

export default function AccountPage() {
  return (
    <div>
      <h1 className="font-medium text-2xl mb-4">Thông tin tài khoản</h1>
      <div>
        <SetBreadCrump
          breadcrumps={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản", href: "/account" },
          ]}
        ></SetBreadCrump>
        <AccountForm></AccountForm>
      </div>
    </div>
  );
}
