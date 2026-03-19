"use client";
import CustomInput from "@/components/common/custom-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ROUTE } from "@/constants/routes";
import accountService from "@/libs/services/account.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Home, SendHorizonal } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  token: string;
}

const formSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ").nonempty(),
  otp: z.string().nonempty(),
  token: z.string().nonempty(),
});

function AdminChangeEmailForm({ token }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { token },
    mode: "onSubmit",
  });

  const [done, setDone] = React.useState(false);

  const { mutate: sendOtp, isPending: isSending } = useMutation({
    mutationFn: async (email: string) =>
      accountService.adminSendOtp2ChangeEmail(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const { mutate: changeEmail, isPending: isChanging } = useMutation({
    mutationFn: async (data: { email: string; otp: string }) =>
      accountService.adminConfirmChangeEmail({
        token,
        newEmail: data.email,
        otp: data.otp,
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      setDone(true);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  if (done) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <CheckCircle2 className="size-10 text-green-400" />
        <p className="font-semibold opacity-50">Đã cập nhật thành công</p>
        <Link href={ROUTE.admin}>
          <Button className="">
            <Home />
            <span>Trang chủ</span>
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        className="space-y-2"
        onSubmit={form.handleSubmit((val) => changeEmail(val))}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ fieldState, field }) => (
            <FormItem>
              <FormLabel className="font-semibold opacity-50">
                Địa chỉ email:
              </FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otp"
          render={({ fieldState, field }) => (
            <FormItem>
              <FormLabel className="font-semibold opacity-50">OTP:</FormLabel>
              <FormControl className="flex gap-2 items-end">
                <div>
                  <CustomInput
                    {...field}
                    isError={fieldState.invalid}
                    type="number"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    className="flex gap-1 justify-center items-center text-nowrap px-2 py-1 rounded-sm cursor-pointer"
                    disabled={isSending}
                    onClick={() => sendOtp(form.getValues("email"))}
                  >
                    <SendHorizonal className="size-4" />
                    <span>Gửi OTP</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Gửi OTP đến email mới của bạn. Nếu không nhận được, có thể thử
                gửi lại lần nữa.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button className="flex ms-auto" disabled={isChanging}>
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}

export default AdminChangeEmailForm;
