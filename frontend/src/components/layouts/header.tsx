"use client";
import SearchInput from "@/components/common/search-input";
import React, { useEffect } from "react";
import Link from "next/link";
import { ROUTE } from "@/constants/routes";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { useAuthActions, useUser } from "@/store/auth-store";
import { useModalActions } from "@/store/modal-store";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import accountService from "@/libs/services/account.service";
import { authService } from "@/libs/services/auth.service";

const accountMenu = [
  { icon: "bx bx-user", title: "Tài khoản của tôi", href: ROUTE.userAccount },
  { icon: "bx bx-notepad", title: "Đơn hàng", href: ROUTE.userOrder },
];

export default function Header() {
  const user = useUser();
  const { setUser, clearAuth } = useAuthActions();
  const { openModal } = useModalActions();
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: accountService.getMe,
  });
  const { mutate: logoutMutate } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      clearAuth();
    },
  });
  useEffect(() => {
    if (data?.data) {
      setUser({
        email: data.data.email,
        name: data.data.user.name,
        avatarUrl: data.data.user.avatarUrl,
        role: data.data.role,
      });
    }
  }, [data, setUser]);

  return (
    <div className="flex justify-around items-center p-3 space-x-40 bg-primary">
      <Link href="/">
        <Image
          className="size-10"
          src="/uploads/ic.jpg"
          alt="avatar"
          width={40}
          height={40}
        ></Image>
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
                <p className="text-sm text-nowrap">{user.name}</p>
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
                <p
                  className="hover:bg-primary-light hover:text-primary p-2 cursor-pointer flex items-center"
                  onClick={() => {
                    if (confirm("Bạn có chắc muốn đăng xuất?")) logoutMutate();
                  }}
                >
                  <i className="bx bx-log-out me-2 text-xl"></i>
                  Đăng xuất
                </p>
              </ul>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <div
            className="cursor-pointer text-center"
            onClick={() =>
              openModal({
                type: "auth",
                props: {
                  onLoginSuccess: () => {
                    toast.success("Đăng nhập thành công");
                  },
                },
              })
            }
          >
            <i className="bx bxs-user-circle text-4xl"></i>
            <p className="text-sm text-nowrap">Đăng nhập</p>
          </div>
        )}
      </div>
    </div>
  );
}
