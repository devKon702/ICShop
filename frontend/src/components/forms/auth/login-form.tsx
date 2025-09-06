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
import Input from "@/components/common/input";
import { useGlobalContext } from "@/libs/contexts/GlobalContext";
import SendToEmailForm from "@/components/forms/send-to-email-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const formSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Tối thiểu 6 kí tự").max(25, "Tối đa 25 kí tự"),
});

export default function LoginForm() {
  const { setAuthMode, setUser } = useGlobalContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  icon={
                    <i className="bx bxs-envelope text-xl text-white bg-black p-3"></i>
                  }
                  type="email"
                  placeholder="example@gmail.com"
                  isError={!!fieldState.invalid}
                  {...field}
                ></Input>
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
                <Input
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
            onClick={() => setAuthMode("register")}
          >
            Đăng ký
          </span>
        </p>
        <button
          className="bg-black text-white rounded-sm px-4 py-2 cursor-pointer opacity-80 hover:opacity-100 ms-auto block"
          onClick={() => {
            setUser("Nhật Kha");
            setAuthMode(null);
          }}
        >
          Đăng nhập
        </button>
      </form>
    </Form>
  );
}
