"use client";
import Input from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  alias: z.string(),
  province: z.string(),
  district: z.string(),
  commune: z.string(),
  detail: z.string(),
  receiver_name: z.string(),
  receiver_phone: z.string(),
});

export default function AddressForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4 rounded-md p-3 bg-white shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          name="alias"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tên địa chỉ</FormLabel>
              <FormControl>
                <Input type="text" {...field} isError={!!fieldState.invalid} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="province"
          control={form.control}
          render={(field) => (
            <FormItem>
              <FormLabel>Tỉnh / Thành phố</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger {...field} className="w-full">
                    <SelectValue placeholder="Chọn tỉnh thành"></SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                  <SelectItem value="An Giang">An Giang</SelectItem>
                  <SelectItem value="Đồng Tháp">Đồng Tháp</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="district"
          control={form.control}
          render={(field) => (
            <FormItem>
              <FormLabel>Quận huyện</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger {...field} className="w-full">
                    <SelectValue placeholder="Chọn quận huyện"></SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Gò Vấp">Gò Vấp</SelectItem>
                  <SelectItem value="Quận 10">Quận 10</SelectItem>
                  <SelectItem value="Thủ Đức">Thủ Đức</SelectItem>
                  <SelectItem value="Bình Thạnh">Bình Thạnh</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="province"
          control={form.control}
          render={(field) => (
            <FormItem>
              <FormLabel>Phường xã</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger {...field} className="w-full">
                    <SelectValue placeholder="Chọn tỉnh thành"></SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Phường 1">Phường 1</SelectItem>
                  <SelectItem value="Phường 2">Phường 2</SelectItem>
                  <SelectItem value="Phường 3">Phường 3</SelectItem>
                  <SelectItem value="Phường 4">Phường 4</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="detail"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Địa chỉ chi tiết</FormLabel>
              <FormControl>
                <Input type="text" {...field} isError={!!fieldState.invalid} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormLabel>Người nhận</FormLabel>
        <div className="flex space-x-8 w-full">
          <FormField
            name="receiver_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    icon={<User />}
                    {...field}
                    isError={!!fieldState.invalid}
                    placeholder="Họ tên"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="receiver_phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    icon={<Phone />}
                    type="text"
                    {...field}
                    isError={!!fieldState.invalid}
                    placeholder="Số điện thoại"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <button className="block cursor-pointer bg-black rounded-md p-2 text-white ms-auto">
          Xác nhận
        </button>
      </form>
    </Form>
  );
}
