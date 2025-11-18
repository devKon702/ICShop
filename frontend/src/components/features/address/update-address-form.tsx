"use client";
import CustomInput from "@/components/common/custom-input";
import LocationSelector from "@/components/features/address/location-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import addressService from "@/libs/services/address.service";
import { useModalActions } from "@/store/modal-store";
import { phoneRegex, vietnameseRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const schema = z.object({
  alias: z.string().max(10, "Tối đa 10 ký tự"),
  provinceId: z.number(),
  districtId: z.number(),
  wardId: z.number(),
  detail: z.string().max(100, "Tối đa 100 ký tự"),
  receiverName: z.string().regex(vietnameseRegex(), "Tên không hợp lệ"),
  receiverPhone: z
    .string()
    .regex(phoneRegex(), "Số điện thoại không hợp lệ theo định dạng Việt Nam"),
});
interface UpdateAddressFormProps {
  address: {
    id: number;
    alias: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    detail: string;
    receiverName: string;
    receiverPhone: string;
  };
}
export default function UpdateAddressForm({ address }: UpdateAddressFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      alias: address.alias,
      provinceId: address.provinceId,
      districtId: address.districtId,
      wardId: address.wardId,
      detail: address.detail,
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
    },
    mode: "onSubmit",
  });
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();

  const { mutate: updateAddressMutate, isPending: isUpdating } = useMutation({
    mutationFn: (data: Required<z.infer<typeof schema>>) =>
      addressService.update(address.id, data),
    onSuccess: () => {
      toast.success("Cập nhật địa chỉ thành công");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || "Cập nhật địa chỉ thất bại");
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (
            data.provinceId === 0 ||
            data.districtId === 0 ||
            data.wardId === 0
          ) {
            toast.error("Vui lòng chọn đầy đủ địa chỉ");
            return;
          }
          updateAddressMutate(data);
        })}
        className="space-y-4 rounded-md p-3 bg-white shadow-xl w-3xl max-h-[80dvh] overflow-y-auto"
      >
        <FormField
          name="alias"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tên địa chỉ (*)</FormLabel>
              <FormControl>
                <CustomInput
                  type="text"
                  {...field}
                  isError={!!fieldState.invalid}
                />
              </FormControl>
              {fieldState.error?.message !== "Required" && (
                <FormMessage className="text-end" />
              )}
            </FormItem>
          )}
        />
        <LocationSelector
          initialProvinceId={address.provinceId}
          initialDistrictId={address.districtId}
          initialWardId={address.wardId}
          onProvinceChange={(id) => {
            form.setValue("provinceId", id || 0);
          }}
          onDistrictChange={(id) => {
            form.setValue("districtId", id || 0);
          }}
          onWardChange={(id) => {
            form.setValue("wardId", id || 0);
          }}
        />
        <FormField
          name="detail"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Địa chỉ chi tiết (*)</FormLabel>
              <FormControl>
                <CustomInput
                  type="text"
                  {...field}
                  isError={!!fieldState.invalid}
                />
              </FormControl>
              {fieldState.error?.message !== "Required" && (
                <FormMessage className="text-end" />
              )}
            </FormItem>
          )}
        />
        <FormLabel>Người nhận (*)</FormLabel>
        <div className="flex space-x-8 w-full items-start">
          <FormField
            name="receiverName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <CustomInput
                    type="text"
                    icon={<User />}
                    {...field}
                    isError={!!fieldState.invalid}
                    placeholder="Họ tên"
                  />
                </FormControl>
                {fieldState.error?.message !== "Required" && (
                  <FormMessage className="text-end" />
                )}
              </FormItem>
            )}
          />
          <FormField
            name="receiverPhone"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <CustomInput
                    type="number"
                    icon={<Phone />}
                    {...field}
                    isError={!!fieldState.invalid}
                    placeholder="Số điện thoại"
                  />
                </FormControl>
                {fieldState.error?.message !== "Required" && (
                  <FormMessage className="text-end" />
                )}
              </FormItem>
            )}
          />
        </div>
        <Button
          className="block cursor-pointer bg-black rounded-md p-2 text-white ms-auto"
          disabled={isUpdating}
        >
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
