"use client";
import { ROUTE } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

const menu = [
  { icon: "bx bx-user", title: "Tài khoản của tôi", href: ROUTE.userAccount },
  { icon: "bx bx-notepad", title: "Đơn hàng", href: ROUTE.userOrder },
  {
    icon: "bx bx-map-pin",
    title: "Địa chỉ nhận hàng",
    href: ROUTE.userAddress,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <div className="flex space-x-2 w-full">
      <div className="w-1/4 bg-white p-2 shadow-xl rounded-md flex flex-col">
        {menu.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="hover:bg-primary-light hover:text-primary p-2 flex items-center data-[active=true]:text-primary data-[active=true]:bg-primary-light"
            data-active={pathName === item.href}
          >
            <i className={`${item.icon} me-2 text-xl`}></i>
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex-1 bg-white py-2 px-4 shadow-xl rounded-md min-h-96">
        <Suspense fallback={<p>Loading</p>}>{children}</Suspense>
      </div>
    </div>
  );
}
