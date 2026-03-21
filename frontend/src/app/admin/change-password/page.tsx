"use client";
import AdminConfirmChangePasswordForm from "@/components/features/auth/admin-confirm-change-password-form";
import React, { Suspense } from "react";

function AdminChangePasswordPage() {
  return (
    <Suspense fallback={<div></div>}>
      <AdminConfirmChangePasswordForm />
    </Suspense>
  );
}

export default AdminChangePasswordPage;
