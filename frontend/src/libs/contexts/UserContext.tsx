"use client";
import { Breadcrump } from "@/types/breadcrump";
import { createContext, ReactNode, useContext, useState } from "react";

interface UserContextProps {
  breadcrump: Breadcrump[];
  setBreadcrump: (value: UserContextProps["breadcrump"]) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrump, setBreadcrump] = useState<UserContextProps["breadcrump"]>(
    []
  );
  return (
    <UserContext.Provider value={{ breadcrump, setBreadcrump }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
