"use client";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalContext } from "@/libs/contexts/GlobalContext";
import React from "react";

export default function AuthModal() {
  const { authMode, setAuthMode } = useGlobalContext();
  return (
    <Dialog open={!!authMode} onOpenChange={(o) => !o && setAuthMode(null)}>
      <DialogContent className="max-h-11/12 overflow-y-scroll app">
        <Tabs defaultValue="login" className="">
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
            className="bg-white p-3 rounded-md shadow-xl"
          >
            <LoginForm></LoginForm>
          </TabsContent>
          <TabsContent
            value="register"
            className="bg-white p-3 rounded-md shadow-xl"
          >
            <RegisterForm></RegisterForm>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
