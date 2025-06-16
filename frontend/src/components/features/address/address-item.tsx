"use client";
import { useAddressContext } from "@/libs/contexts/AddressContext";
import { MapPin, Phone, User } from "lucide-react";
import React from "react";

interface AddressItemProps {
  id: string;
  alias: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  district: string;
  commune: string;
  detail: string;
}

export default function AddressItem({
  alias,
  receiver_name,
  receiver_phone,
  province,
  district,
  commune,
  detail,
}: AddressItemProps) {
  const { setOpen } = useAddressContext();
  return (
    <div
      className="p-2 rounded-md shadow-sm space-y-2 cursor-pointer hover:bg-primary-light"
      onClick={() => setOpen(true)}
    >
      <p className="font-medium text-xl">{alias}</p>
      <div className="flex space-x-2 items-center">
        <MapPin size={"1rem"} />
        <p className="font-light text-sm">{`${detail}, ${commune}, ${district}, ${province}`}</p>
      </div>
      <div className="flex space-x-4">
        <span className="flex items-center">
          <User size="1rem" className="me-2" />
          {receiver_name}
        </span>
        <span className="flex items-center">
          <Phone size="1rem" className="me-2" />
          {receiver_phone}
        </span>
      </div>
    </div>
  );
}
