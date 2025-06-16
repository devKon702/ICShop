import AddressList from "@/components/features/address/address-list";
import AddressProvider from "@/libs/contexts/AddressContext";
import React from "react";

export default function AddressPage() {
  return (
    <AddressProvider>
      <div>
        <h1 className="font-medium text-2xl mb-4">Địa chỉ nhận hàng</h1>
        <AddressList></AddressList>
      </div>
    </AddressProvider>
  );
}
