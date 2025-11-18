"use client";
import LoginForm from "@/components/features/auth/login-form";
import RegisterForm from "@/components/features/auth/register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface AuthTabsProps {
  onLoginSuccess?: () => void;
}

export default function AuthTabs({ onLoginSuccess }: AuthTabsProps) {
  const [tab, setTab] = React.useState<"login" | "register">("login");
  return (
    <div className="w-2xl p-2">
      <Tabs
        defaultValue="login"
        className="flex flex-col"
        value={tab}
        onValueChange={(val) => setTab(val as "login" | "register")}
      >
        <TabsList className="grid grid-cols-2 w-full border-2 h-fit mb-2 mt-4 p-0">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black text-xl cursor-pointer rounded-none rounded-tl-sm rounded-bl-md transition-all duration-200"
          >
            Đăng nhập
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black text-xl cursor-pointer rounded-none rounded-tr-sm rounded-br-md transition-all duration-200"
          >
            Đăng ký
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="login"
          className="bg-white p-3 rounded-md shadow-xl flex-1 overflow-y-auto app"
        >
          <LoginForm
            onLoginSuccess={onLoginSuccess}
            onRegisterClick={() => setTab("register")}
          />
        </TabsContent>
        <TabsContent
          value="register"
          className="bg-white p-3 rounded-md shadow-xl flex-1 overflow-y-auto app"
        >
          <RegisterForm redirectLogin={() => setTab("login")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
