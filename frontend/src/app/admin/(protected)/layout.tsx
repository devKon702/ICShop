"use client";

import AdminSidebar from "@/components/layouts/admin-sidebar";
import { ROUTE } from "@/constants/routes";
import { useUser } from "@/store/user-store";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const pageTitles = [
  { href: ROUTE.adminDashboard, title: "Dashboard" },
  { href: ROUTE.adminOrder, title: "Quản lí đơn hàng" },
  { href: ROUTE.adminCategory, title: "Quản lí danh mục" },
  { href: ROUTE.adminProduct, title: "Quản lí sản phẩm" },
  { href: ROUTE.adminUser, title: "Quản lí người dùng" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace(ROUTE.adminLogin);
    }
  }, [user, router]);
  if (user?.role !== "admin") return null;
  return (
    <div className="p-6 h-screen">
      <div className="flex bg-white rounded-md p-2 size-full shadow-lg">
        <section className="w-1/6">
          <AdminSidebar></AdminSidebar>
        </section>
        <section className="flex-1 overflow-auto app px-4 py-2">
          <h1 className="font-bold text-2xl mb-6">
            {pageTitles.find((item) => item.href == pathname)?.title}
          </h1>
          {children}
        </section>
      </div>
    </div>
  );
}
