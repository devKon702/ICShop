"use client";
import CustomInput from "@/components/common/custom-input";
import SafeImage from "@/components/common/safe-image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import env from "@/constants/env";
import accountService from "@/libs/services/account.service";
import { useModalActions } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
  const { openModal, closeModal } = useModalActions();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      avatarUrl: "",
      name: "",
      email: "",
      phone: "",
    },
    mode: "onSubmit",
    disabled: true,
  });

  const {} = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      accountService.getMe().then((res) => {
        form.reset({
          avatarUrl: res.data.user.avatarUrl || "",
          name: res.data.user.name,
          email: res.data.email,
          phone: res.data.user.phone || "",
        });
        return res;
      }),
  });

  return (
    <Form {...form}>
      <form
        action=""
        className="w-full flex space-x-4 pb-8"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) => {
          if (confirm("Xác nhận cập nhật thông tin tài khoản?")) {
            accountService.updateMe({
              name: data.name,
              phone: data.phone,
              email: data.email,
            });
          }
        })}
      >
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
                  <SafeImage
                    src={`${env.NEXT_PUBLIC_FILE_URL}/${field.value}`}
                    alt="Hình đại diện"
                    avatarPlaceholderName=""
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
                          onImageComplete(file, previewUrl) {
                            form.setValue("avatarUrl", previewUrl);
                            closeModal();
                          },
                        },
                      });
                    }
                  }}
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
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
          {form.formState.disabled ? (
            <Button
              className="px-4 py-2 text-primary w-fit rounded-md cursor-pointer ms-auto border-2 border-primary bg-transparent hover:bg-transparent"
              onClick={() => {
                form.control._disableForm(false);
              }}
            >
              Cập nhật
            </Button>
          ) : (
            <div className="flex justify-end">
              <Button
                className="flex px-4 py-2 bg-primary w-fit text-white rounded-md cursor-pointer ms-auto"
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
                onClick={() => {
                  form.control._disableForm(true);
                }}
              >
                Xác nhận
              </Button>
              <Button
                variant="outline"
                className="flex px-4 py-2 w-fit rounded-md cursor-pointer ms-2"
                onClick={() => {
                  form.control._disableForm(true);
                  form.reset();
                }}
              >
                Hủy
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
