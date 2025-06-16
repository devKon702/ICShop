"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextProps {
  user: string | null;
  setUser: (user: string | null) => void;
  authMode: "login" | "register" | "forget-password" | null;
  setAuthMode: (mode: GlobalContextProps["authMode"]) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [authMode, setAuthMode] =
    useState<GlobalContextProps["authMode"]>(null);

  return (
    <GlobalContext.Provider value={{ user, setUser, authMode, setAuthMode }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
