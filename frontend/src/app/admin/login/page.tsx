"use client";
import AdminLoginForm from "@/components/forms/auth/admin-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function AdminLoginPage() {
  return (
    <div className="fixed inset-0 grid place-items-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl text-center">
            Đăng nhập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminLoginForm></AdminLoginForm>
        </CardContent>
      </Card>
    </div>
  );
}
