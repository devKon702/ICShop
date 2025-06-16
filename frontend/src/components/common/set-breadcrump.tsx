"use client";
import { useUserContext } from "@/libs/contexts/UserContext";
import { Breadcrump } from "@/types/breadcrump";
import { useEffect } from "react";

export default function SetBreadCrump({
  breadcrumps,
}: {
  breadcrumps: Breadcrump[];
}) {
  const { setBreadcrump } = useUserContext();
  useEffect(() => {
    setBreadcrump(breadcrumps);
  }, [breadcrumps, setBreadcrump]);
  return null;
}
