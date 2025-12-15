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
import { authService } from "@/libs/services/auth.service";
import { createErrorHandler } from "@/utils/response-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

interface Props {
  email: string;
  token: string;
}

export default function ResetPasswordForm({ email, token }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate: resetPasswordMutate, isPending } = useMutation({
    mutationFn: (data: { password: string }) =>
      authService.resetPassword({ email, token, password: data.password }),
    onSuccess: (data) => {
      toast.success(data.message || "Đặt lại mật khẩu thành công");
    },
    onError: (error) => {
      const handler = createErrorHandler(
        [],
        [
          {
            type: "API",
            handler(message: string) {
              toast.error(message);
            },
          },
        ]
      );
      handler(error);
    },
  });
  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4 w-full"
        onSubmit={form.handleSubmit((data) => {
          resetPasswordMutate({ password: data.password });
        })}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="bg-black text-white rounded-sm px-4 py-2 cursor-pointer opacity-80 hover:opacity-100 ms-auto block"
          disabled={isPending}
        >
          Đặt lại mật khẩu
        </button>
      </form>
    </Form>
  );
}
