"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ROUTE } from "@/constants/routes";
import {
  KeyRound,
  MapPin,
  Menu,
  ScrollText,
  SquareUserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const menu: { icon: ReactNode; title: string; href: string }[] = [
  {
    icon: <SquareUserRound className="p-1" />,
    title: "Tài khoản của tôi",
    href: ROUTE.userAccount,
  },
  {
    icon: <KeyRound className="p-1" />,
    title: "Đổi mật khẩu",
    href: ROUTE.userChangePassword,
  },
  {
    icon: <MapPin className="p-1" />,
    title: "Địa chỉ nhận hàng",
    href: ROUTE.userAddress,
  },
  {
    icon: <ScrollText className="p-1" />,
    title: "Đơn hàng",
    href: ROUTE.userOrder,
  },
] as const;

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  return (
    <div className="flex flex-col items-start gap-2 md:flex-row w-full">
      <Drawer direction="left">
        <DrawerTrigger>
          <Button className="me-auto">
            <Menu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="bg-white h-full p-2 shadow-xl rounded-md md:flex flex-col sticky top-30 md:h-fit space-y-1">
            {menu.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:bg-primary/10 p-2 flex items-center space-x-2 data-[active=true]:bg-primary/80 data-[active=true]:font-semibold rounded-md"
                data-active={pathName === item.href}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      <div className="hidden w-1/4 bg-white p-2 shadow-xl rounded-md md:flex flex-col sticky top-30 h-fit space-y-1">
        {menu.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="hover:bg-primary/10 p-2 flex items-center space-x-2 data-[active=true]:bg-primary/80 data-[active=true]:font-semibold rounded-md"
            data-active={pathName === item.href}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
      <div className="w-full md:flex-1 bg-white py-2 px-4 shadow-xl rounded-md min-h-96">
        {children}
      </div>
    </div>
  );
}
