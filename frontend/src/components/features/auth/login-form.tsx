"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/common/custom-input";
import SendToEmailForm from "@/components/features/auth/send-to-email-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/libs/services/auth.service";
import { ApiErrorResponseSchema } from "@/libs/schemas/response.schema";
import { useAuthActions } from "@/store/auth-store";
import { toast } from "sonner";
import { useModalActions } from "@/store/modal-store";

const formSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Tối thiểu 6 kí tự").max(25, "Tối đa 25 kí tự"),
});

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onRegisterClick: () => void;
}

export default function LoginForm({
  onLoginSuccess: onLogin,
  onRegisterClick,
}: LoginFormProps) {
  const { login } = useAuthActions();
  const { closeModal } = useModalActions();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });
  const { mutate: loginMutate } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      authService.login(data.email, data.password),
    onSuccess: ({ data }) => {
      login(
        {
          email: data.account.email,
          avatarUrl: data.account.user.avatarUrl,
          name: data.account.user.name,
          role: data.account.role,
        },
        data.token
      );
      closeModal();
      toast.success("Đăng nhập thành công");
      onLogin?.();
    },
    onError: (error: unknown) => {
      const parsedError = ApiErrorResponseSchema.safeParse(error);
      if (parsedError.success) {
        const errorResponse = parsedError.data;
        toast.error(errorResponse.message);
      } else {
        toast.error("Đăng nhập thất bại, vui lòng thử lại");
        console.error("Login error:", error);
      }
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data: z.infer<typeof formSchema>) => {
          loginMutate({ email: data.email, password: data.password });
        })}
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
                  placeholder="example@gmail.com"
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
                  placeholder="example123"
                  isError={!!fieldState.invalid}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Dialog>
          <DialogTrigger className="cursor-pointer text-blue-500 hover:underline">
            Quên mật khẩu?
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quên mật khẩu</DialogTitle>
              <DialogDescription>
                Nhập email để lấy lại mật khẩu
              </DialogDescription>
            </DialogHeader>
            <SendToEmailForm></SendToEmailForm>
          </DialogContent>
        </Dialog>

        <div className="w-full rounded-sm bg-white flex items-center justify-center py-2 cursor-pointer border-2 hover:opacity-80 transition-all font-medium">
          <i className="bx bxl-google me-2"></i>Đăng nhập với Google
        </div>
        <p className="text-center">
          Bạn chưa có tài khoản?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={onRegisterClick}
          >
            Đăng ký
          </span>
        </p>
        <button className="bg-black text-white rounded-sm px-4 py-2 cursor-pointer opacity-80 hover:opacity-100 ms-auto block">
          Đăng nhập
        </button>
      </form>
    </Form>
  );
}
