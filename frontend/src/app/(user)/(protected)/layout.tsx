"use client";
import ProtectedLayer from "@/components/features/auth/protected-layer";
import { useRouter } from "next/navigation";
import React from "react";

export default function UserProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <ProtectedLayer
      role="user"
      onUnauthorized={() => {
        router.replace("/");
      }}
    >
      {children}
    </ProtectedLayer>
  );
}
