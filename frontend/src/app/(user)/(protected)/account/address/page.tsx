"use client";
import AddressList from "@/components/features/address/address-list";
import { Button } from "@/components/ui/button";
import { useModalActions } from "@/store/modal-store";
import { Plus } from "lucide-react";
import React from "react";

export default function AddressPage() {
  const { openModal } = useModalActions();
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-medium text-2xl mb-4">Địa chỉ nhận hàng</h1>
        <Button
          onClick={() =>
            openModal({ type: "createAddress", props: { onSuccess: () => {} } })
          }
        >
          <Plus /> <span>Thêm địa chỉ</span>
        </Button>
      </div>
      <AddressList></AddressList>
    </div>
  );
}
