"use client";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SECURITY_CODE } from "@/constants/api-code";
import { useInterval } from "@/libs/hooks/useInterval";
import { authService } from "@/libs/services/auth.service";
import { useModalActions } from "@/store/modal-store";
import { formatTime } from "@/utils/date";
import { emailRegex, phoneRegex } from "@/utils/regex";
import { createErrorHandler } from "@/utils/response-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  CheckCheck,
  Key,
  Mail,
  Phone,
  SendHorizonalIcon,
  User,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    name: z
      .string({ message: "Tên không được để trống" })
      .min(2, "Tên tối thiểu 2 kí tự")
      .max(20, "Tên tối thiểu 20 kí tự"),
    phone: z
      .string({ message: "Số điện thoại không được để trống" })
      .trim()
      .regex(
        phoneRegex(),
        "Số điện thoại không hợp lệ theo định dạng Việt Nam"
      ),
    email: z
      .string({ message: "Email không được để trống" })
      .email("Email không đúng định dạng"),
    otp: z.string({ message: "OTP không được để trống" }).length(6),
    password: z
      .string({ message: "Mật khẩu không được để trống" })
      .min(6, "Tối thiểu 6 kí tự")
      .max(100, "Tối đa 100 kí tự"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Mật khẩu xác nhận không khớp",
  });

interface RegisterFormProps {
  redirectLogin: () => void;
}

export default function RegisterForm({ redirectLogin }: RegisterFormProps) {
  const [remainSeconds, setRemainSeconds] = React.useState<number | null>(null);
  const { openModal, closeModal } = useModalActions();
  useInterval(
    () => {
      setRemainSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) return 0;
        return prev - 1;
      });
    },
    remainSeconds !== null || remainSeconds == 0 ? 1000 : null
  );
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  const { mutate: sendOtpMutate, isPending: isSendingOtp } = useMutation({
    mutationFn: async ({ email, token }: { email: string; token?: string }) =>
      authService.sendOtp({ email, token }),
    onSuccess: (data) => {
      setRemainSeconds(
        Math.round(
          (new Date(data.data.expiresAt).getTime() - new Date().getTime()) /
            1000
        )
      );
      toast.success(`Đã gửi OTP đến ${data.data.email}`);
    },
    onError: (error) => {
      const handler = createErrorHandler(
        {
          [SECURITY_CODE.TOO_MANY_REQUESTS]: () => {
            openModal({
              type: "captcha",
              props: {
                onVerify: async (token) => {
                  sendOtpMutate({ email: form.getValues("email"), token });
                  closeModal();
                },
              },
            });
          },
        },
        {
          ["API"]: (message) => {
            toast.error(message);
          },
        }
      );
      handler(error);
    },
  });
  const { mutate: signupMutate } = useMutation({
    mutationFn: async (data: {
      email: string;
      otp: string;
      password: string;
      name: string;
      phone: string;
    }) => authService.signup(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công, bạn có thể đăng nhập ngay bây giờ");
      redirectLogin();
    },
    onError: (error) => {
      const handler = createErrorHandler(
        {},
        {
          API: (message) => toast.error(message),
          NETWORK: () => toast.error("Lỗi mạng, vui lòng thử lại"),
          TIMEOUT: () => toast.error("Yêu cầu thất bại, vui lòng thử lại"),
        }
      );
      handler(error);
    },
  });
  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4 flex-1 app"
        onSubmit={form.handleSubmit((data) =>
          signupMutate({
            name: data.name,
            email: data.email,
            otp: data.otp,
            phone: data.phone,
            password: data.password,
          })
        )}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <CustomInput
                  type="text"
                  icon={
                    <div className="text-white bg-black p-3">
                      <User />
                    </div>
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
                <div className="flex items-center">
                  <CustomInput
                    type="email"
                    icon={
                      <div className="text-white bg-black p-3">
                        <Mail />
                      </div>
                    }
                    isError={fieldState.invalid}
                    placeholder="Email"
                    {...field}
                  />
                  <button
                    className="h-full aspect-square text-center rounded-sm bg-primary/10 text-primary ms-2 flex justify-center items-center cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Gửi OTP"
                    disabled={isSendingOtp}
                    type="button"
                    onClick={() => {
                      const emailValue = form.getValues("email");
                      if (emailRegex().test(emailValue))
                        sendOtpMutate({ email: emailValue });
                      else {
                        form.setError("email", {
                          type: "manual",
                          message: "Email không đúng định dạng",
                        });
                      }
                    }}
                  >
                    {isSendingOtp ? (
                      <div className="size-4 rounded-full border-2 border-b-transparent border-primary animate-spin" />
                    ) : (
                      <SendHorizonalIcon />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="otp"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã OTP</FormLabel>
              <FormDescription>
                {remainSeconds ? (
                  <span>
                    Đã gửi đến email của bạn. Mã hết hạn sau{" "}
                    <strong className="text-red-400">
                      {`${formatTime(remainSeconds, {
                        hours: false,
                        minutes: true,
                        seconds: true,
                      })} giây`}
                    </strong>
                    <br />
                    Nếu không nhận được, hãy kiểm tra thư mục spam hoặc thư mục
                    rác, sau đó vui lòng gửi lại.
                  </span>
                ) : remainSeconds === 0 ? (
                  "Mã OTP đã hết hạn, vui lòng gửi lại"
                ) : (
                  "Nhập email và gửi mã OTP để xác thực email của bạn"
                )}
              </FormDescription>
              <FormControl>
                <InputOTP
                  tabIndex={0}
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="w-5/6"
                >
                  <InputOTPGroup className="w-full space-x-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-10 border flex-1 shadow rounded-md data-[active=true]:ring-0"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <CustomInput
                  tabIndex={0}
                  type="text"
                  icon={
                    <div className="text-white bg-black p-3">
                      <Phone />
                    </div>
                  }
                  isError={fieldState.invalid}
                  placeholder="Số điện thoại"
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
                <CustomInput
                  type="password"
                  icon={
                    <div className="text-white bg-black p-3">
                      <Key />
                    </div>
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
                <CustomInput
                  type="password"
                  icon={
                    <div className="text-white bg-black p-3">
                      <CheckCheck />
                    </div>
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
          <span
            className="ms-1 text-primary cursor-pointer hover:underline"
            onClick={redirectLogin}
          >
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
