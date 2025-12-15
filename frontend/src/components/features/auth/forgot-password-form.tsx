import CustomInput from "@/components/common/custom-input";
import {
  Form,
  FormControl,
  FormDescription,
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

const schema = z.object({
  email: z.string().email("Email không đúng định dạng"),
});

export default function ForgotPasswordForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: { email: "" },
  });

  const { mutate: forgotPasswordMutate, isPending } = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (data) => {
      toast.success(data.message || "Đã gửi mã OTP đến email của bạn");
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
          {
            type: "NETWORK",
            handler() {
              toast.error("Lỗi mạng, vui lòng thử lại sau");
            },
          },
          {
            type: "UNKNOWN",
            handler() {
              toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
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
        className="space-y-4 w-[40dvw] p-2"
        onSubmit={form.handleSubmit((data) => {
          forgotPasswordMutate(data.email);
        })}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <CustomInput
                  type="email"
                  icon={
                    <i className="bx bxs-envelope text-xl bg-black text-white p-3"></i>
                  }
                  placeholder="example@gmail.com"
                  isError={fieldState.invalid}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Vui lòng nhập email tài khoản của bạn để nhận mã đặt lại mật
                khẩu
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="bg-black text-white rounded-sm px-4 py-2 cursor-pointer opacity-80 hover:opacity-100 ms-auto block disabled:opacity-50 disabled:cursor-default"
          disabled={isPending}
        >
          Gửi
        </button>
      </form>
    </Form>
  );
}
