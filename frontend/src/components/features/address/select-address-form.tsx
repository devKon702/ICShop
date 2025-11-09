"use client";
import AddressSelector from "@/components/features/address/address-selector";
import { Button } from "@/components/ui/button";
import addressService from "@/libs/services/address.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  onSelect?: (addressId: number) => void;
  onSubmit: (addressId: number) => void;
}

export default function SelectAddressForm({ onSelect, onSubmit }: Props) {
  const [selectedAddressId, setSelectedAddressId] = React.useState<
    number | undefined
  >(undefined);

  const { data: addressData } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => addressService.getMyAddresses(),
  });

  return (
    <div className="p-4 flex flex-col space-y-4 min-w-[40dvw]">
      <AddressSelector
        data={
          addressData?.data.map((item) => ({
            id: item.id,
            alias: item.alias,
            detail: item.detail,
            wardName: item.ward.name,
            districtName: item.district.name,
            provinceName: item.province.name,
            receiverName: item.receiverName,
            receiverPhone: item.receiverPhone,
          })) || []
        }
        onSelect={(addressId) => {
          setSelectedAddressId(addressId);
          onSelect?.(addressId);
        }}
        defaultValue={selectedAddressId}
      />
      <Button
        className="ml-auto"
        disabled={!selectedAddressId}
        onClick={() => selectedAddressId && onSubmit(selectedAddressId)}
      >
        Xác nhận
      </Button>
    </div>
  );
}
