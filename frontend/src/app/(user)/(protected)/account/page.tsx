import AccountForm from "@/components/forms/account-form";
import React from "react";

export default function AccountPage() {
  return (
    <div>
      <h1 className="font-medium text-2xl mb-4">Thông tin tài khoản</h1>
      <div>
        <AccountForm></AccountForm>
      </div>
    </div>
  );
}
