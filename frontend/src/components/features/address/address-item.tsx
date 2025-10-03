"use client";
import { useModalActions } from "@/store/modal-store";
import { MapPin, Phone, User } from "lucide-react";
import React from "react";

interface AddressItemProps {
  address: {
    id: number;
    alias: string;
    receiverName: string;
    receiverPhone: string;
    province: string;
    provinceCode: number;
    district: string;
    districtCode: number;
    commune: string;
    communeCode: number;
    detail: string;
  };
}

export default function AddressItem({ address }: AddressItemProps) {
  const { openModal } = useModalActions();
  return (
    <div
      className="p-2 rounded-md shadow-sm space-y-2 cursor-pointer hover:bg-primary-light"
      onClick={() =>
        openModal({
          type: "updateAddress",
          props: { data: address, onSuccess: () => {} },
        })
      }
    >
      <p className="font-medium text-xl">{address.alias}</p>
      <div className="flex space-x-2 items-center">
        <MapPin size={"1rem"} />
        <p className="font-light text-sm">{`${address.detail}, ${address.commune}, ${address.district}, ${address.province}`}</p>
      </div>
      <div className="flex space-x-4">
        <span className="flex items-center">
          <User size="1rem" className="me-2" />
          {
            <address className="font-light text-sm">
              {address.receiverName}
            </address>
          }
        </span>
        <span className="flex items-center">
          <Phone size="1rem" className="me-2" />
          {
            <address className="font-light text-sm">
              {address.receiverPhone}
            </address>
          }
        </span>
      </div>
    </div>
  );
}
