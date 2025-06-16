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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    name: z
      .string()
      .min(2, "Tên tối thiểu 2 kí tự")
      .max(20, "Tên tối thiểu 20 kí tự"),
    email: z.string().email("Email không đúng định dạng"),
    password: z
      .string()
      .min(6, "Tối thiểu 6 kí tự")
      .max(100, "Tối đa 100 kí tự"),
    confirm: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Mật khẩu xác nhận không khớp",
  });

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  icon={
                    <i className="bx bxs-user text-xl text-white bg-black p-3"></i>
                  }
                  isError={fieldState.invalid}
                  placeholder="Nguyễn Văn A"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  icon={
                    <i className="bx bxs-envelope text-xl text-white bg-black p-3"></i>
                  }
                  isError={fieldState.invalid}
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  icon={
                    <i className="bx bxs-lock text-xl text-white bg-black p-3"></i>
                  }
                  isError={fieldState.invalid}
                  placeholder="example123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirm"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  icon={
                    <i className="bx bx-check-double text-xl text-white bg-black p-3"></i>
                  }
                  isError={fieldState.invalid}
                  placeholder="example123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-center">
          Bạn đã có tài khoản?{" "}
          <span className="ms-1 text-primary cursor-pointer hover:underline">
            Đăng nhập
          </span>
        </p>
        <button
          className="bg-black text-white rounded-sm px-4 py-2 cursor-pointer opacity-80 hover:opacity-100 ms-auto block"
          onClick={() => {}}
        >
          Đăng ký
        </button>
      </form>
    </Form>
  );
}
