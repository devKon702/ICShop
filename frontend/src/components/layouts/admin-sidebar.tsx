"use client";
import { ROUTE } from "@/constants/routes";
import {
  CircleArrowLeft,
  LayoutDashboard,
  Microchip,
  SquareMenu,
  SquareStack,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const sidebarMenu = [
  { href: ROUTE.adminDashboard, title: "Dashboard", icon: <LayoutDashboard /> },
  { href: ROUTE.adminOrder, title: "Đơn hàng", icon: <SquareMenu /> },
  { href: ROUTE.adminCategory, title: "Danh mục", icon: <SquareStack /> },
  { href: ROUTE.adminProduct, title: "Sản phẩm", icon: <Microchip /> },
  { href: ROUTE.adminUser, title: "Người dùng", icon: <User /> },
];

export default function AdminSidebar({}) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col size-full p-2 border-r-2">
      <p className="font-medium text-2xl px-4">Admin</p>
      <div className="h-[2px] bg-background my-4"></div>
      <div className="flex-1 overflow-y-auto app">
        {sidebarMenu.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            data-selected={pathname === item.href}
            className="flex space-x-2 justify-start rounded-md opacity-80 hover:bg-gray-100 data-[selected=true]:bg-primary-light p-3 cursor-pointer"
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </div>
      <button
        type="button"
        className="flex space-x-2 justify-start rounded-md p-3 cursor-pointer shadow-lg w-full"
      >
        <CircleArrowLeft />
        <span>Đăng xuất</span>
      </button>
    </ul>
  );
}
