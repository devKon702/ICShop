"use client";

import LoadingIcon from "@/components/common/loading-icon";
import SafeImage from "@/components/common/safe-image";
import ProtectedLayer from "@/components/features/auth/protected-layer";
import AdminSidebar from "@/components/layouts/admin-sidebar";
import { ROUTE } from "@/constants/routes";
import accountService from "@/libs/services/account.service";
import { useAuthActions } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { toast } from "sonner";

const pageTitles = [
  { href: ROUTE.adminDashboard, title: "Thống kê" },
  { href: ROUTE.adminOrder, title: "Quản lí đơn hàng" },
  { href: ROUTE.adminCategory, title: "Quản lí danh mục" },
  { href: ROUTE.adminProduct, title: "Quản lí sản phẩm" },
  { href: ROUTE.adminHighlight, title: "Quản lí sản phẩm nổi bật" },
  { href: ROUTE.adminShowcase, title: "Quản lí sản phẩm trưng bày" },
  { href: ROUTE.adminUser, title: "Quản lí người dùng" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setUser, clearAuth } = useAuthActions();
  const [allowed, setAllowed] = React.useState(false);
  const pathname = usePathname();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: accountService.getMe,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      clearAuth();
      router.replace(ROUTE.adminLogin);
      return;
    }
    if (data) {
      const user = data.data.user;
      setUser({
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: data.data.email,
        role: data.data.role,
        phone: user.phone,
      });
      setAllowed(true);
    }
  }, [isLoading, isError, data, clearAuth, router, setUser]);

  if (!allowed)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <LoadingIcon />
      </div>
    );

  return (
    <ProtectedLayer
      role="admin"
      onUnauthorized={() => {
        clearAuth();
        router.push(ROUTE.adminLogin);
        toast.info("Vui lòng đăng nhập lại");
      }}
    >
      <div className="p-6 h-screen">
        <div className="flex bg-white rounded-md p-2 size-full shadow-lg">
          <section className="w-1/6">
            <AdminSidebar></AdminSidebar>
          </section>
          <section className="flex-1 overflow-auto app px-4 py-2">
            <div className="flex items-center justify-between mb-4 rounded-lg">
              <h1 className="font-bold text-2xl">
                {pageTitles.find((item) => item.href == pathname)?.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{data?.data.user.name}</span>
                <SafeImage
                  key={data?.data.user.avatarUrl || ""}
                  src={data?.data.user.avatarUrl || ""}
                  alt="Avatar"
                  height={40}
                  width={40}
                  className="rounded-full"
                />
              </div>
            </div>
            {children}
          </section>
        </div>
      </div>
    </ProtectedLayer>
  );
}
