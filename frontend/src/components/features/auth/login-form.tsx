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
import { Lock, Mail } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

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
          phone: data.account.user.phone,
        },
        data.token
      );
      onLogin?.();
      toast.success("Đăng nhập thành công");
      closeModal();
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

  const { mutate: googleLoginMutate } = useMutation({
    mutationFn: async (token: string) => authService.loginWithGoogle(token),
    onSuccess: ({ data, message }) => {
      login(
        {
          email: data.account.email,
          avatarUrl: data.account.user.avatarUrl,
          name: data.account.user.name,
          role: data.account.role,
          phone: data.account.user.phone,
        },
        data.token
      );
      toast.success(message);
      onLogin?.();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập thất bại, vui lòng thử lại");
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
                    <div className="p-3 bg-black text-white">
                      <Mail />
                    </div>
                  }
                  type="email"
                  placeholder="example@gmail.com"
                  isError={!!fieldState.invalid}
                  autoFocus
                  {...field}
                  className="overflow-hidden"
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
                    <div className="p-3 bg-black text-white">
                      <Lock />
                    </div>
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

        {/* <div
          className="w-full rounded-sm bg-white flex items-center justify-center py-2 cursor-pointer border-2 hover:opacity-80 transition-all font-medium space-x-4"
          onClick={() => googleLogin()}
        >
          <Image src="/google-icon.svg" alt="Google" width={24} height={24} />
          <span>Đăng nhập với Google</span>
        </div> */}
        <div className="w-fit mx-auto">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential)
                googleLoginMutate(credentialResponse.credential);
              else {
                console.log("No credential returned");
              }
            }}
            onError={() => {
              toast.error("Đăng nhập thất bại, vui lòng thử lại");
            }}
            width={"100%"}
            text="continue_with"
            type="standard"
            theme="outline"
            size="large"
            logo_alignment="left"
          />
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
