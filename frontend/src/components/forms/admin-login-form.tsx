"use client";
import Input from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ROUTE } from "@/constants/routes";
import { authService } from "@/libs/services/auth.service";
import { useUser, useUserActions } from "@/store/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Tối thiểu 6 kí tự").max(25, "Tối đa 25 kí tự"),
});

export default function AdminLoginForm() {
  const { login } = useUserActions();
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user?.role === "admin") router.replace(ROUTE.admin);
  }, [user, router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    authService
      .adminLogin(values.email, values.password)
      .then((res) => {
        toast.success(res.data.message, { position: "bottom-right" });
        const account = res.data.data.account;
        login(
          {
            id: account.id,
            avatarUrl: account.user.avatarUrl,
            email: account.email,
            name: account.user.name,
            role: account.role,
          },
          res.data.data.token
        );
      })
      .catch((e) => {
        toast.error(e.data.message, { position: "bottom-right" });
      });
  }
  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  icon={
                    <i className="bx bxs-envelope text-xl text-white bg-black p-3"></i>
                  }
                  type="email"
                  isError={!!fieldState.invalid}
                  {...field}
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  icon={
                    <i className="bx bxs-lock text-xl text-white bg-black p-3"></i>
                  }
                  type="password"
                  isError={!!fieldState.invalid}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button className="flex bg-black font-semibold text-white cursor-pointer opacity-80 hover:opacity-100 p-2 rounded-lg ms-auto">
          Đăng nhập
        </button>
      </form>
    </Form>
  );
}
