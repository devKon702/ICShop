import AdminLockAccountForm from "@/components/features/auth/admin-lock-account-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircleIcon } from "lucide-react";
import React from "react";

interface Props {
  searchParams: Promise<{ token: string; expiresAt: string }>;
}

async function AdminLockAccountPage({ searchParams }: Props) {
  const { token, expiresAt } = await searchParams;
  if (!token || !expiresAt) {
    throw new Error("Missing token or expiresAt");
  }
  return (
    <div className="fixed inset-0 grid place-items-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl text-center">
            Xác nhận đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          {new Date(expiresAt) > new Date() ? (
            <AdminLockAccountForm token={token} />
          ) : (
            <div className="flex flex-col space-y-2 items-center">
              <XCircleIcon className="size-10 text-red-400" />
              <p className="font-semibold opacity-50">
                Thao tác đã hết hiệu lực
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminLockAccountPage;
