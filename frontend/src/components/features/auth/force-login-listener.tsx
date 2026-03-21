"use client";
import { useIsAuthenticated, useUser } from "@/store/auth-store";
import { useModalActions } from "@/store/modal-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  searchParams: { action?: string; redirect?: string };
}

function ForceLoginListener({ searchParams }: Props) {
  const { action, redirect } = searchParams;
  const router = useRouter();
  const { openModal } = useModalActions();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    // Ignored if not yet checked authentication or already authenticated
    if (isAuthenticated === null || (user && isAuthenticated)) return;
    if (action === "login") {
      toast.info("Vui lòng đăng nhập để tiếp tục");
      openModal({
        type: "auth",
        props: {
          onLoginSuccess: () => {
            router.replace(redirect || "/");
          },
        },
      });
    }
  }, [user, isAuthenticated, router, openModal, action, redirect]);
  return null;
}

export default ForceLoginListener;
