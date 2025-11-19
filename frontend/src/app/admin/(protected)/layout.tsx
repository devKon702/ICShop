"use client";

import LoadingIcon from "@/components/common/loading-icon";
import SafeImage from "@/components/common/safe-image";
import ProtectedLayer from "@/components/features/auth/protected-layer";
import AdminSidebar from "@/components/layouts/admin-sidebar";
import { ROLE } from "@/constants/enums";
import { ROUTE } from "@/constants/routes";
import accountService from "@/libs/services/account.service";
import {
  useAuthActions,
  useIsAuthenticated,
  useUser,
} from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const pageTitles = [
  { href: ROUTE.adminDashboard, title: "Thống kê" },
  { href: ROUTE.adminOrder, title: "Quản lí đơn hàng" },
  { href: ROUTE.adminCategory, title: "Quản lí danh mục" },
  { href: ROUTE.adminProduct, title: "Quản lí sản phẩm" },
  { href: ROUTE.adminHighlight, title: "Quản lí sản phẩm nổi bật" },
  { href: ROUTE.adminCollection, title: "Quản lí bộ sưu tập" },
  { href: ROUTE.adminUser, title: "Quản lí người dùng" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setUser, clearAuth, setIsAuthenticated } = useAuthActions();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const pathname = usePathname();
  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      accountService
        .getMe()
        .then((res) => {
          setUser({
            name: res.data.user.name,
            avatarUrl: res.data.user.avatarUrl,
            email: res.data.email,
            role: res.data.role,
            phone: res.data.user.phone,
          });
          setIsAuthenticated(true);
          return res;
        })
        .catch((err) => {
          clearAuth();
          return err;
        }),
    staleTime: 5 * 60 * 1000, // 5 minutes,
  });

  if (isAuthenticated === null || isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <LoadingIcon />
      </div>
    );

  return (
    <ProtectedLayer
      role={ROLE.ADMIN}
      onUnauthorized={() => {
        router.replace(ROUTE.adminLogin + "?redirect=" + pathname);
      }}
    >
      <div className="p-6 h-screen">
        <div className="flex bg-white rounded-md p-2 size-full shadow-lg">
          <section className="w-1/6">
            <AdminSidebar></AdminSidebar>
          </section>
          <section className="flex-1 overflow-auto app px-4 py-2 flex flex-col">
            <div className="flex items-center justify-between mb-4 rounded-lg">
              <h1 className="font-bold text-2xl">
                {pageTitles.find((item) => item.href == pathname)?.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{user?.name}</span>
                <SafeImage
                  key={user?.avatarUrl}
                  src={!!user?.avatarUrl ? user?.avatarUrl : undefined}
                  appFileBase
                  avatarPlaceholderName={user?.name}
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
