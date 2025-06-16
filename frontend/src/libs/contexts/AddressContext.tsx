"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Address = {
  id: string;
  alias: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  district: string;
  commune: string;
  detail: string;
};

interface AddressContextProps {
  address: Address | null;
  setAddress: (address: Address | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddressContext = createContext<AddressContextProps | undefined>(
  undefined
);

export default function AddressProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  return (
    <AddressContext.Provider value={{ open, setOpen, address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddressContext must be used within a AddressProvider");
  }
  return context;
};
