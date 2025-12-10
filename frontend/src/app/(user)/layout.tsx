"use client";
import FloatButton from "@/components/features/contact/float-button";
import TopBreadcrump from "@/components/layouts/top-breadcrumb";
import CategoryBar from "@/components/layouts/category-bar";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import { UserProvider } from "@/libs/contexts/UserContext";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalActions } from "@/store/modal-store";
import { toast } from "sonner";
import { useIsAuthenticated, useUser } from "@/store/auth-store";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useSearchParams();
  const router = useRouter();
  const { openModal } = useModalActions();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    // Ignored if not yet checked authentication or already authenticated
    if (isAuthenticated === null || (user && isAuthenticated)) return;
    if (params.get("action") === "login") {
      toast.info("Vui lòng đăng nhập để tiếp tục");
      openModal({
        type: "auth",
        props: {
          onLoginSuccess: () => {
            router.replace(params.get("redirect") || "/");
          },
        },
      });
    }
  }, [user, isAuthenticated, params, router, openModal]);
  return (
    <UserProvider>
      <>
        <div className="sticky top-0 z-50">
          <Header />
          <CategoryBar />
        </div>
        <TopBreadcrump />
        <div className="mx-24 my-2">{children}</div>
        <Footer />
        <FloatButton />
      </>
    </UserProvider>
  );
}
