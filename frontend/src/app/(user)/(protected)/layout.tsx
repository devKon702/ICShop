"use client";
import ProtectedLayer from "@/components/features/auth/protected-layer";
import { ROLE } from "@/constants/enums";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function UserProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  return (
    <ProtectedLayer
      role={ROLE.USER}
      onUnauthorized={() => {
        router.replace(`/?action=login&redirect=${path}`);
      }}
    >
      {children}
    </ProtectedLayer>
  );
}
