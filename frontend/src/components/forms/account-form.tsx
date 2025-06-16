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
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  avatarUrl: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

export default function AccountForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      avatarUrl: "",
      name: "Nguyễn Nhật Kha",
      email: "nhatkha117@gmail.com",
      phone: "",
    },
    mode: "all",
    disabled: true,
  });

  return (
    <Form {...form}>
      <form action="" className="w-full flex space-x-4 pb-8">
        <FormField
          name="avatarUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="size-40 grid place-items-center">
                <div
                  className="relative size-30 mx-auto shrink-0 rounded-full overflow-hidden group data-[disabled=false]:cursor-pointer"
                  data-disabled={!!field.disabled}
                >
                  <Image
                    src={"/uploads/ic.jpg"}
                    alt="Hình đại diện"
                    width={200}
                    height={200}
                    className="object-cover size-full"
                  />
                  {field.disabled || (
                    <div className="group-hover:absolute inset-0 bg-black opacity-70 grid place-items-center">
                      <i className="bx bx-camera text-6xl text-white"></i>
                    </div>
                  )}
                </div>
                <p className="font-normal text-center">
                  Ảnh định dạng jpg, png. Tối đa 10MB
                </p>
              </FormLabel>
              <FormControl>
                <input
                  type="file"
                  hidden
                  {...field}
                  accept="image/jpg, image/png, image/jpeg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex-1 space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    isError={fieldState.invalid}
                    className="disabled:opacity-60"
                    {...field}
                  ></Input>
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
                    type="text"
                    isError={fieldState.invalid}
                    className="disabled:opacity-60"
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.disabled ? (
            <div
              className="px-4 py-2 text-primary w-fit rounded-md cursor-pointer ms-auto border-2 border-primary"
              onClick={() => {
                form.control._disableForm(false);
              }}
            >
              Chỉnh sửa
            </div>
          ) : (
            <div
              className="px-4 py-2 bg-primary w-fit text-white rounded-md cursor-pointer ms-auto"
              onClick={() => {
                form.control._disableForm(true);
              }}
            >
              Xác nhận thay đổi
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
