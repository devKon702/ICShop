"use client";
import AppSelector from "@/components/common/app-selector";
import CustomInput from "@/components/common/custom-input";
import AddressSelector from "@/components/features/address/address-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DeliveryType } from "@/constants/enums";
import addressService from "@/libs/services/address.service";
import orderService from "@/libs/services/order.service";
import { useModalActions } from "@/store/modal-store";
import { phoneRegex, vietnameseRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  order: {
    id: number;
    deliveryType: DeliveryType;
    receiverName?: string;
    receiverPhone?: string;
  };
}

const schema = z.object({
  post: z
    .object({
      addressId: z.number(),
    })
    .optional(),
  shop: z
    .object({
      receiverName: z
        .string({ message: "Tên không được để trống" })
        .regex(vietnameseRegex(), "Tên không hợp lệ")
        .max(100, "Tên không được vượt quá 100 kí tự"),
      receiverPhone: z
        .string({ message: "Số điện thoại không được để trống" })
        .regex(phoneRegex(), "Số điện thoại không hợp lệ"),
    })
    .optional(),
});

export default function ChangeOrderAddressForm({ order }: Props) {
  const [type, setType] = React.useState<DeliveryType>(order.deliveryType);
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      post:
        order.deliveryType === DeliveryType.POST
          ? {
              addressId: undefined,
            }
          : undefined,
      shop:
        order.deliveryType === DeliveryType.SHOP
          ? {
              receiverName: order.receiverName,
              receiverPhone: order.receiverPhone,
            }
          : undefined,
    },
    mode: "onSubmit",
  });

  const { data: addressData } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => addressService.getMyAddresses(),
  });

  const { mutate: changeAddressMutate } = useMutation({
    mutationFn: (data: {
      deliveryType: DeliveryType;
      addressId?: number;
      receiverName?: string;
      receiverPhone?: string;
    }) => orderService.user.updateAddress(order.id, data),
    onSuccess: () => {
      toast.success("Thay đổi địa chỉ thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      closeModal();
    },
    onError: (e) => {
      toast.error(e.message || "Thay đổi địa chỉ thất bại. Vui lòng thử lại.");
    },
  });

  return (
    <Form {...form}>
      <form
        className="p-4 flex flex-col space-y-4 min-w-[40dvw] bg-white"
        onSubmit={form.handleSubmit(
          (data: z.infer<typeof schema>) => {
            if (confirm("Xác nhận thay đổi thông tin nhận hàng?")) {
              changeAddressMutate({
                deliveryType: type,
                ...(type === DeliveryType.POST
                  ? { addressId: data.post?.addressId }
                  : {
                      receiverName: data.shop?.receiverName,
                      receiverPhone: data.shop?.receiverPhone,
                    }),
              });
            }
          },
          (error) => {
            console.log("Validation Errors: ", error);
          }
        )}
        onError={() => {
          toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại.");
        }}
      >
        <AppSelector
          data={
            [
              {
                label: "Nhận tại cửa hàng",
                value: `${DeliveryType.SHOP}`,
              },
              { label: "Giao hàng", value: `${DeliveryType.POST}` },
            ] as const
          }
          defaultValue={`${order.deliveryType}`}
          onValueChange={(val) => {
            if (val === DeliveryType.SHOP.toString())
              form.setValue("post", undefined);
            if (val === DeliveryType.POST.toString())
              form.setValue("shop", undefined);
            setType(Number(val));
          }}
          className="w-full"
        />
        {type === DeliveryType.SHOP ? (
          <>
            <FormField
              control={form.control}
              name="shop.receiverName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-semibold opacity-50">
                    Tên người nhận
                  </FormLabel>
                  <CustomInput
                    {...field}
                    type="text"
                    isError={fieldState.invalid}
                    placeholder="Tên người nhận..."
                    maxLength={100}
                  />
                  <div className="flex items-start justify-between">
                    <FormMessage />
                    <span className="text-xs opacity-50 ml-auto">
                      {field.value?.length}/100
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shop.receiverPhone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-semibold opacity-50">
                    Số điện thoại
                  </FormLabel>
                  <CustomInput
                    {...field}
                    type="number"
                    isError={fieldState.invalid}
                    placeholder="Số điện thoại..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <FormField
            control={form.control}
            name="post.addressId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold opacity-50">
                  Địa chỉ nhận hàng
                </FormLabel>
                <AddressSelector
                  data={
                    addressData?.data.map((item) => ({
                      id: item.id,
                      alias: item.alias,
                      detail: item.detail,
                      wardName: item.ward.name,
                      districtName: item.district.name,
                      provinceName: item.province.name,
                      receiverName: item.receiverName,
                      receiverPhone: item.receiverPhone,
                    })) || []
                  }
                  defaultValue={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          className="ml-auto"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
          type="submit"
        >
          Xác nhận
        </Button>
      </form>
    </Form>
  );
}
