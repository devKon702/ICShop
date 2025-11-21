"use client";
import CustomInput from "@/components/common/custom-input";
import SafeImage from "@/components/common/safe-image";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import env from "@/constants/env";
import { useInterval } from "@/libs/hooks/useInterval";
import accountService from "@/libs/services/account.service";
import { authService } from "@/libs/services/auth.service";
import { userService } from "@/libs/services/user.service";
import { useModalActions } from "@/store/modal-store";
import { formatTime } from "@/utils/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Pencil, Send, Upload } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const otpLength = 6;

const schema = z.object({
  avatarUrl: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  otp: z
    .string()
    .regex(/^\d+$/, "OTP chỉ được chứa các chữ số")
    .length(otpLength, `OTP phải có ${otpLength} kí tự`)
    .optional(),
});

export default function AccountForm() {
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [otpExpiredAt, setOtpExpiredAt] = React.useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(
    null
  );
  const { openModal, closeModal } = useModalActions();
  useInterval(() => {
    if (otpExpiredAt) {
      const now = new Date();
      const diff = Math.max(
        0,
        Math.floor((otpExpiredAt.getTime() - now.getTime()) / 1000)
      );
      setRemainingSeconds(diff);
    }
  }, 1000);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: async () =>
      accountService.getMe().then((res) => ({
        avatarUrl: env.NEXT_PUBLIC_FILE_URL + "/" + res.data.user.avatarUrl,
        name: res.data.user.name,
        email: res.data.email,
        phone: res.data.user.phone || "",
        otp: "",
      })),
    mode: "onSubmit",
  });

  const queryClient = useQueryClient();

  const { mutate: sendOtpMutation, isPending: isSendingOtpMutation } =
    useMutation({
      mutationFn: (email: string) => authService.sendOtp({ email }),
      onSuccess: (data) => {
        toast.success(`Đã gửi OTP đến email ${data.data.email}`);
        setOtpExpiredAt(new Date(data.data.expiredAt));
      },
      onError: () => {
        toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
      },
    });

  useEffect(() => {
    form.control._disableForm(true);
  }, [form.control]);

  useEffect(() => {
    if (form.getFieldState("email").isDirty) {
      setRemainingSeconds(null);
    }
  }, [form]);

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col space-y-4 pb-8"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) => {
          const ps = [];
          if (confirm("Xác nhận cập nhật thông tin tài khoản?")) {
            // Update email if changed
            if (form.getFieldState("email").isDirty) {
              if (data.otp === undefined) {
                form.setError("otp", { message: "Vui lòng nhập OTP" });
                return;
              }
              ps.push(
                accountService
                  .updateEmail({ email: data.email, otp: data.otp })
                  .then(() => {
                    form.reset(
                      { ...data, otp: undefined },
                      { keepDirty: false }
                    );
                  })
              );
            }
            // Update profile if changed
            if (
              form.getFieldState("name").isDirty ||
              form.getFieldState("phone").isDirty ||
              form.getFieldState("avatarUrl").isDirty
            ) {
              ps.push(
                userService
                  .updateProfile({
                    name: data.name,
                    phone: data.phone,
                    avatarFile: avatarFile || undefined,
                  })
                  .then(() => {
                    form.reset(
                      {
                        ...data,
                        otp: undefined,
                      },
                      { keepDirty: false }
                    );
                    queryClient.invalidateQueries({
                      queryKey: ["me"],
                    });
                  })
              );
            }
            Promise.all(ps)
              .then(() => {
                toast.success("Cập nhật thông tin tài khoản thành công");
                form.control._disableForm(true);
              })
              .catch((e) => {
                toast.error(
                  e.message || "Cập nhật thông tin tài khoản thất bại"
                );
              });
          }
        })}
      >
        <FormField
          name="avatarUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình đại diện</FormLabel>
              <div className="flex space-x-2 items-end">
                <SafeImage
                  key={field.value}
                  src={field.value}
                  alt="Hình đại diện"
                  avatarPlaceholderName={form.getValues("name")}
                  width={200}
                  height={200}
                  className="size-[100px] aspect-square rounded-xl border border-gray-300"
                />
                <FormLabel>
                  <div
                    data-disabled={form.formState.disabled}
                    className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-md cursor-pointer hover:bg-primary/80 text-sm data-[disabled=true]:pointer-events-none data-[disabled=true]:hidden"
                  >
                    <Upload className="size-4" />
                    <span>Tải lên</span>
                  </div>
                </FormLabel>
              </div>
              <FormControl>
                <input
                  disabled={form.formState.disabled}
                  type="file"
                  hidden
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={(e) => {
                    if (
                      e.currentTarget.files &&
                      e.currentTarget.files.length > 0
                    ) {
                      openModal({
                        type: "imageCropper",
                        props: {
                          file: e.currentTarget.files[0],
                          cropAspect: 1,
                          minimizeMB: 0.5,
                          onImageComplete(file, previewUrl) {
                            field.onChange(previewUrl);
                            setAvatarFile(file);
                            closeModal();
                          },
                        },
                      });
                    }
                  }}
                />
              </FormControl>
              <FormDescription className="text-sm">
                Sử dụng ảnh 1x1, dung lượng tối đa 512kB
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2 items-center">
          <FormField
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <CustomInput
                    type="text"
                    isError={fieldState.invalid}
                    className="disabled:opacity-60"
                    {...field}
                  ></CustomInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <CustomInput
                    type="number"
                    isError={fieldState.invalid}
                    className="disabled:opacity-60"
                    {...field}
                  ></CustomInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex space-x-2 items-center">
                  <CustomInput
                    type="text"
                    isError={fieldState.invalid}
                    className="disabled:opacity-60"
                    {...field}
                  />
                  {fieldState.isDirty && (
                    <Button
                      type="button"
                      className="bg-primary/10 hover:bg-primary/20 text-gray-500 disabled:cursor-progress"
                      disabled={isSendingOtpMutation}
                      onClick={() => {
                        sendOtpMutation(field.value);
                      }}
                    >
                      <Send />
                      <span>Gửi OTP</span>
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getFieldState("email").isDirty && (
          <FormField
            name="otp"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={otpLength}
                    value={field.value}
                    onChange={field.onChange}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="flex space-x-2 w-full">
                      {Array.from({ length: otpLength }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="border flex-1 shadow rounded-md data-[active=true]:ring-0"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
                <FormDescription className="text-sm">
                  <div className="flex justify-between">
                    {isSendingOtpMutation ? (
                      <span>Đang gửi OTP...</span>
                    ) : (
                      remainingSeconds !== null && (
                        <span>
                          Không nhận được OTP?{" "}
                          <span
                            className="text-primary cursor-pointer hover:underline"
                            onClick={() => {
                              sendOtpMutation(form.getValues("email"));
                            }}
                          >
                            Gửi lại
                          </span>
                        </span>
                      )
                    )}
                    <div>
                      {remainingSeconds !== null && remainingSeconds <= 0 && (
                        <span className="text-red-600">OTP đã hết hạn</span>
                      )}
                      {remainingSeconds !== null && remainingSeconds > 0 && (
                        <span>
                          Hết hạn sau:{" "}
                          <span className="font-bold text-red-400">
                            {formatTime(remainingSeconds, {
                              hours: false,
                              minutes: true,
                              seconds: true,
                            })}{" "}
                          </span>
                          giây
                        </span>
                      )}
                    </div>
                  </div>
                </FormDescription>
              </FormItem>
            )}
          />
        )}

        <div className="flex space-y-4 justify-end">
          {form.formState.disabled ? (
            <Button
              type="button"
              className="px-4 py-2 rounded-md cursor-pointer border-2"
              onClick={() => {
                form.control._disableForm(false);
              }}
            >
              <Pencil className="size-3" />
              Cập nhật
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex px-4 py-2 w-fit rounded-md cursor-pointer"
                onClick={() => {
                  form.control._disableForm(true);
                  form.reset();
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex px-4 py-2 bg-primary w-fit text-white rounded-md cursor-pointer"
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              >
                Xác nhận
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
