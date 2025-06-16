"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUserContext } from "@/libs/contexts/UserContext";

export default function TopBreadcrump() {
  const { breadcrump } = useUserContext();
  if (breadcrump.length == 0) return null;
  return (
    <div className="mx-24 rounded-md bg-white p-2 mt-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrump.map((item, index) =>
            index != breadcrump.length - 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
