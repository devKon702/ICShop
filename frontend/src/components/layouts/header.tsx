"use client";
import React from "react";
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
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import useDebounce from "@/libs/hooks/useDebouce";
import productService from "@/libs/services/product.service";
import { formatPrice } from "@/utils/price";

const accountMenu = [
  { icon: "bx bx-user", title: "Tài khoản của tôi", href: ROUTE.userAccount },
  { icon: "bx bx-notepad", title: "Đơn hàng", href: ROUTE.userOrder },
];

export default function Header() {
  const user = useUser();
  const searchInutRef = React.useRef<HTMLDivElement>(null);
  const { setUser, setIsAuthenticated, clearAuth } = useAuthActions();
  const { openModal } = useModalActions();
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showSearch, setShowSearch] = React.useState(false);
  const {} = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      accountService.getMe().then((data) => {
        setUser({
          email: data.data.email,
          name: data.data.user.name,
          avatarUrl: data.data.user.avatarUrl,
          role: data.data.role,
          phone: data.data.user.phone,
        });
        setIsAuthenticated(true);
        return data;
      }),
    staleTime: 60 * 1000, // 1 minute
    enabled: !user,
  });

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  const { data: searchedProducts, isLoading } = useQuery({
    queryKey: ["products", "search", { name: debouncedSearchTerm.trim() }],
    queryFn: () =>
      productService.searchByName({
        name: debouncedSearchTerm.trim(),
        limit: 5,
      }),
    enabled: debouncedSearchTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { mutate: logoutMutate } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      clearAuth();
    },
  });

  return (
    <div className="flex items-center p-3 bg-primary shadow-lg">
      <Link href="/" className="text-white font-bold text-2xl px-4">
        IoT Shop
      </Link>
      <Popover
        open={showSearch && !!searchedProducts}
        onOpenChange={setShowSearch}
      >
        <PopoverAnchor asChild>
          <InputGroup
            className="bg-white w-1/4 mr-auto has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0"
            ref={searchInutRef}
          >
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Tìm kiếm..."
              className="w-full"
              onChange={(e) => {
                const value = e.currentTarget.value;
                setSearchTerm(value);
                if (value.trim().length > 0 !== showSearch) {
                  setShowSearch(value.trim().length > 0);
                }
              }}
            />
            {isLoading && (
              <InputGroupAddon align="inline-end">
                <div className="border-3 border-blue-400 border-t-transparent rounded-full animate-spin duration-500 size-4"></div>
              </InputGroupAddon>
            )}
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent
          className="min-w-[50dvw] max-h-[40dvh] overflow-y-auto app shadow-lg p-2"
          align="start"
          side="bottom"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          {searchedProducts && (
            <div>
              {searchedProducts.data.total === 0 && (
                <p className="p-2">Không có sản phẩm nào</p>
              )}
              {searchedProducts.data.result.map((product) => (
                <Link
                  key={product.id}
                  href={ROUTE.product + `/${product.slug}`}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100"
                >
                  <SafeImage
                    key={product.posterUrl}
                    src={product.posterUrl || undefined}
                    appFileBase
                    width={40}
                    height={40}
                    className="rounded-full aspect-square"
                  />
                  <div className="flex flex-col space-y-1">
                    <ClampText
                      className=""
                      text={product.name}
                      lines={1}
                      showTitle
                    />
                    <span className="font-semibold text-sm">
                      {formatPrice(Number(product.price))} vnđ
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
      <div className="flex space-x-5">
        <Link
          href={ROUTE.cart}
          className="relative cursor-pointer flex flex-col items-center"
          title="Giỏ hàng"
          onClick={(e) => {
            if (!user) {
              toast.info("Vui lòng đăng nhập để xem giỏ hàng");
              openModal({
                type: "auth",
                props: {
                  onLoginSuccess: () => {},
                },
              });
              e.preventDefault();
            }
          }}
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
                  onLoginSuccess: () => {},
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
