"use client";
import AddressItem from "@/components/features/address/address-item";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import addressService from "@/libs/services/address.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressList() {
  const { data: addressResponse, isLoading } = useQuery({
    queryKey: ["address", "me"],
    queryFn: addressService.getMyAddresses,
  });
  return (
    <ul className="space-y-2 w-full shadow">
      {!isLoading && <Skeleton className="w-full rounded-md h-20" />}
      {addressResponse?.data?.map((item) => (
        <AddressItem key={item.id} address={{ ...item }}></AddressItem>
      ))}
    </ul>
  );
}
