"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import SearchInput from "@/components/common/search-input";
import React from "react";
import Link from "next/link";
import { ROUTE } from "@/constants/routes";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGlobalContext } from "@/libs/contexts/GlobalContext";

const accountMenu = [
  { icon: "bx bx-user", title: "Tài khoản của tôi", href: ROUTE.userAccount },
  { icon: "bx bx-notepad", title: "Đơn hàng", href: ROUTE.userOrder },
];

export default function Header() {
  const { setAuthMode, user } = useGlobalContext();
  return (
    <div className="flex justify-around items-center p-3 space-x-40 bg-primary">
      <Link href="/">
        <Avatar className="size-10">
          <AvatarImage src="/uploads/ic.jpg"></AvatarImage>
        </Avatar>
      </Link>
      <SearchInput className="flex-1"></SearchInput>
      <div className="flex space-x-5">
        <Link href={ROUTE.cart} className="cursor-pointer text-center">
          <i className="bx bxs-cart text-4xl"></i>
          <p className="text-sm text-nowrap">Giỏ hàng</p>
        </Link>
        {user ? (
          <HoverCard openDelay={0} closeDelay={20}>
            <HoverCardTrigger>
              <div className="cursor-pointer text-center">
                <i className="bx bxs-user-circle text-4xl"></i>
                <p className="text-sm text-nowrap">{user}</p>
              </div>
            </HoverCardTrigger>

            <HoverCardContent side="left" align="start" className="w-fit">
              <ul>
                {accountMenu.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="hover:bg-primary-light hover:text-primary p-2 flex items-center"
                  >
                    <i className={`${item.icon} me-2 text-xl`}></i>
                    {item.title}
                  </Link>
                ))}
                <p className="hover:bg-primary-light hover:text-primary p-2 cursor-pointer flex items-center">
                  <i className="bx bx-log-out me-2 text-xl"></i>
                  Đăng xuất
                </p>
              </ul>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <div
            className="cursor-pointer text-center"
            onClick={() => setAuthMode("login")}
          >
            <i className="bx bxs-user-circle text-4xl"></i>
            <p className="text-sm text-nowrap">Đăng nhập</p>
          </div>
        )}
      </div>
    </div>
  );
}
