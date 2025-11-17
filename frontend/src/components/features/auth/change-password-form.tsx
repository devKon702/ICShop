import CustomInput from "@/components/common/custom-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import accountService from "@/libs/services/account.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự")
      .refine(
        (val) => !val.includes(" "),
        "Mật khẩu không được chứa khoảng trắng"
      ),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .refine(
        (val) => !val.includes(" "),
        "Mật khẩu không được chứa khoảng trắng"
      ),
    confirmNewPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu mới phải có ít nhất 6 ký tự")
      .refine(
        (val) => !val.includes(" "),
        "Mật khẩu không được chứa khoảng trắng"
      ),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu mới và xác nhận mật khẩu mới không khớp",
    path: ["confirmNewPassword"],
  });

export default function ChangePasswordForm() {
  const [showStates, setShowStates] = React.useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onSubmit",
  });

  const { mutate: changePassword } = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => accountService.changePassword(data),
    onSuccess: () => {
      form.reset();
      toast.success("Đổi mật khẩu thành công");
      // LOG OUT
    },
    onError: (error) => {
      toast.error(error?.message || "Đổi mật khẩu thất bại");
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          });
        })}
        className="space-y-4"
      >
        <FormField
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại (*)</FormLabel>
              <FormControl>
                <CustomInput
                  type={showStates.currentPassword ? "text" : "password"}
                  {...field}
                  isError={fieldState.invalid}
                  icon={
                    <div
                      onClick={() =>
                        setShowStates((prev) => ({
                          ...prev,
                          currentPassword: !prev.currentPassword,
                        }))
                      }
                      className="cursor-pointer p-2"
                    >
                      {showStates.currentPassword ? <Eye /> : <EyeOff />}
                    </div>
                  }
                  iconAlign="end"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới (*)</FormLabel>
              <FormControl>
                <CustomInput
                  type={showStates.newPassword ? "text" : "password"}
                  {...field}
                  isError={fieldState.invalid}
                  icon={
                    <div
                      onClick={() =>
                        setShowStates((prev) => ({
                          ...prev,
                          newPassword: !prev.newPassword,
                        }))
                      }
                      className="cursor-pointer p-2"
                    >
                      {showStates.newPassword ? <Eye /> : <EyeOff />}
                    </div>
                  }
                  iconAlign="end"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmNewPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu mới (*)</FormLabel>
              <FormControl>
                <CustomInput
                  type={showStates.confirmNewPassword ? "text" : "password"}
                  {...field}
                  isError={fieldState.invalid}
                  icon={
                    <div
                      onClick={() =>
                        setShowStates((prev) => ({
                          ...prev,
                          confirmNewPassword: !prev.confirmNewPassword,
                        }))
                      }
                      className="cursor-pointer p-2"
                    >
                      {showStates.confirmNewPassword ? <Eye /> : <EyeOff />}
                    </div>
                  }
                  iconAlign="end"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="ms-auto flex">Đổi mật khẩu</Button>
      </form>
    </Form>
  );
}
