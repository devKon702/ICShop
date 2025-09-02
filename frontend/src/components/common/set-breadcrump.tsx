"use client";
import { useUserContext } from "@/libs/contexts/UserContext";
import { useEffect } from "react";

type Breadcrump = {
  label: string;
  href: string;
};

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
