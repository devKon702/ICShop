import AdminChangeEmailForm from "@/components/features/auth/admin-change-email-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle } from "lucide-react";
import React from "react";

async function AdminChangeEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; expiresAt: string }>;
}) {
  const { token, expiresAt } = await searchParams;
  if (!token || !expiresAt) {
    throw new Error();
  }
  return (
    <div className="fixed inset-0 grid place-items-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl text-center">
            Đổi địa chỉ email
          </CardTitle>
          <CardDescription className="text-center">
            {new Date(expiresAt) > new Date(Date.now()) || (
              <div className="flex flex-col justify-center items-center space-y-2 mt-2">
                <XCircle className="text-red-400 size-10" />
                <span>Thao tác đã hết thời hạn, vui lòng gửi yêu cầu khác</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          {new Date(expiresAt) > new Date(Date.now()) && (
            <AdminChangeEmailForm token={token} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminChangeEmailPage;
