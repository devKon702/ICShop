"use client";
import CustomInput from "@/components/common/custom-input";
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
import { useAuthActions } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Tối thiểu 6 kí tự").max(25, "Tối đa 25 kí tự"),
});

export default function AdminLoginForm() {
  const { login } = useAuthActions();
  const router = useRouter();
  const params = useSearchParams();
  // useEffect(() => {
  //   if (isAuthenticated && user?.role === "admin") {
  //     router.replace(ROUTE.admin);
  //     return;
  //   }
  // }, [user, router, isAuthenticated]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: adminLoginMutate } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      authService.adminLogin(data.email, data.password),
    onSuccess: ({ data, message }) => {
      login(
        {
          avatarUrl: data.account.user.avatarUrl || null,
          email: data.account.email,
          name: data.account.user.name,
          role: data.account.role,
          phone: data.account.user.phone,
        },
        data.token
      );
      toast.success(message);
      router.replace(params.get("redirect") || ROUTE.admin);
    },
    onError: (e) => {
      toast.error(e.message || "Đăng nhập thất bại, vui lòng thử lại");
    },
  });
  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((values) =>
          adminLoginMutate({
            email: values.email,
            password: values.password,
          })
        )}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <CustomInput
                  icon={
                    <i className="bx bxs-envelope text-xl text-white bg-black p-3"></i>
                  }
                  type="email"
                  isError={!!fieldState.invalid}
                  {...field}
                ></CustomInput>
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
                <CustomInput
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
