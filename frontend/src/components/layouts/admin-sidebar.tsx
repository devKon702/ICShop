"use client";
import { ROUTE } from "@/constants/routes";
import { authService } from "@/libs/services/auth.service";
import { useAuthActions } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import {
  ChartArea,
  CircleArrowLeft,
  Microchip,
  Shapes,
  SquareMenu,
  SquareStack,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const sidebarMenu: {
  group: string | null;
  items: { href: string; title: string; icon: React.ReactNode }[];
}[] = [
  {
    group: "Tổng quan",
    items: [
      {
        href: ROUTE.adminDashboard,
        title: "Thống kê",
        icon: <ChartArea className="p-1" />,
      },
    ],
  },
  {
    group: "Kho",
    items: [
      {
        href: ROUTE.adminCategory,
        title: "Danh mục",
        icon: <SquareStack className="p-1" />,
      },
      {
        href: ROUTE.adminProduct,
        title: "Sản phẩm",
        icon: <Microchip className="p-1" />,
      },
      {
        href: ROUTE.adminHighlight,
        title: "Sản phẩm nổi bật",
        icon: <Star className="p-1" />,
      },
      {
        href: ROUTE.adminCollection,
        title: "Bộ sưu tập",
        icon: <Shapes className="p-1" />,
      },
    ],
  },
  {
    group: "Kinh doanh",
    items: [
      {
        href: ROUTE.adminOrder,
        title: "Đơn hàng",
        icon: <SquareMenu className="p-1" />,
      },
      {
        href: ROUTE.adminUser,
        title: "Người dùng",
        icon: <Users className="p-1" />,
      },
    ],
  },
] as const;

export default function AdminSidebar({}) {
  const pathname = usePathname();
  const { clearAuth } = useAuthActions();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      clearAuth();
    },
  });
  return (
    <ul className="flex flex-col size-full border-r-2">
      <p className="font-medium text-2xl px-4">Admin</p>
      <div className="h-[2px] bg-background my-4"></div>
      <div className="flex-1 overflow-y-auto app px-2 space-y-4">
        {sidebarMenu.map((group, index) => (
          <div key={index}>
            <p className="font-semibold opacity-50 text-xs mb-2">
              {group.group}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-selected={pathname === item.href}
                className="flex items-center space-x-1 justify-start rounded-md hover:bg-gray-100 data-[selected=true]:bg-primary data-[selected=true]:text-white p-2 cursor-pointer font-semibold"
              >
                {item.icon}
                <span className="font-medium text-sm">{item.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex space-x-1 justify-start rounded-md p-2 mx-2 cursor-pointer border border-transparent hover:border-background hover:shadow text-sm font-semibold items-center"
        onClick={() => {
          if (confirm("Bạn có muốn đăng xuất không")) {
            logoutMutate();
          }
        }}
      >
        <CircleArrowLeft className="p-1" />
        <span>Đăng xuất</span>
      </button>
    </ul>
  );
}
