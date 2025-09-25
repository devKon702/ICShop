"use client";
import AddressItem from "@/components/features/address/address-item";
import AddressForm from "@/components/features/address/address-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddressContext } from "@/libs/contexts/AddressContext";
import React from "react";

const data = [
  {
    id: "2112",
    alias: "Nhà",
    receiver_name: "Nhật Kha",
    receiver_phone: "094765213",
    province: "HCM",
    district: "Gò Vấp",
    commune: "phường 11",
    detail: "618/60 Quang Trung",
    selected: true,
  },
  {
    id: "212",
    alias: "Nhà",
    receiver_name: "Nhật Kha",
    receiver_phone: "094765213",
    province: "HCM",
    district: "Gò Vấp",
    commune: "phường 11",
    detail: "618/60 Quang Trung",
    selected: false,
  },
  {
    id: "321",
    alias: "Nhà",
    receiver_name: "Nhật Kha",
    receiver_phone: "094765213",
    province: "HCM",
    district: "Gò Vấp",
    commune: "phường 11",
    detail: "618/60 Quang Trung",
    selected: false,
  },
];

export default function AddressList() {
  const { open, setOpen } = useAddressContext();
  return (
    <>
      <ul className="space-y-2">
        {data.map((item) => (
          <AddressItem key={item.id} {...item}></AddressItem>
        ))}
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3/5 max-h-11/12 overflow-y-scroll app">
          <DialogHeader>
            <DialogTitle>Địa chỉ nhận hàng</DialogTitle>
          </DialogHeader>
          <AddressForm></AddressForm>
        </DialogContent>
      </Dialog>
    </>
  );
}
