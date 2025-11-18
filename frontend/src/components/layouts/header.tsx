"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { ROUTE } from "@/constants/routes";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuthActions, useUser } from "@/store/auth-store";
import { useModalActions } from "@/store/modal-store";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import accountService from "@/libs/services/account.service";
import { authService } from "@/libs/services/auth.service";
import SafeImage from "@/components/common/safe-image";
import { Search, ShoppingCart, UserCircle } from "lucide-react";
import Separator from "@/components/common/separator";
import ClampText from "@/components/common/clamp-text";
import cartService from "@/libs/services/cart.service";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
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
        phone: data.data.user.phone,
      });
    }
  }, [data, setUser]);

  return (
    <div className="flex items-center p-3 bg-primary shadow-lg">
      <Link href="/" className="text-white font-bold text-2xl px-4">
        {/* <Image
          className="size-10"
          src="/uploads/ic.jpg"
          alt="avatar"
          width={40}
          height={40}
        /> */}
        IoT Shop
      </Link>
      <InputGroup className="bg-white w-1/4 mr-auto has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Tìm kiếm..." className="w-full" />
      </InputGroup>
      <div className="flex space-x-5">
        <Link
          href={ROUTE.cart}
          className="relative cursor-pointer flex flex-col items-center"
          title="Giỏ hàng"
        >
          <ShoppingCart className="size-10 p-2 hover:bg-black/10 rounded-full transition-all duration-500" />
          <div className="absolute top-0 right-0 translate-x-1/5 -translate-y-1/5 text-xs bg-red-500 text-white font-bold px-1 rounded-full">
            {cartData?.data.length || null}
          </div>
        </Link>
        {user ? (
          <HoverCard openDelay={0} closeDelay={20}>
            <HoverCardTrigger>
              <div className="size-10 cursor-pointer flex flex-col items-center">
                <SafeImage
                  key={user.avatarUrl}
                  src={user.avatarUrl || undefined}
                  avatarPlaceholderName={user.name}
                  appFileBase
                  width={40}
                  height={40}
                  className="rounded-full aspect-square"
                />
              </div>
            </HoverCardTrigger>

            <HoverCardContent side="left" align="start" className="w-fit">
              <ul>
                <ClampText
                  className="px-2"
                  text={user.name}
                  lines={1}
                  showTitle
                />
                <Separator className="my-2" />
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
            title="Đăng nhập"
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
            <UserCircle className="size-10 p-2 hover:bg-black/10 rounded-full transition-all duration-500" />
          </div>
        )}
      </div>
    </div>
  );
}
