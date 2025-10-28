"use client";
import AppSelector from "@/components/common/app-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { OrderStatus } from "@/constants/enums";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
import orderService from "@/libs/services/order.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotebookPen } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  status: z.number().refine((val) => Object.values(OrderStatus).includes(val)),
  desc: z.string().max(100).nonempty(),
});

interface Props {
  currentStatus: OrderStatus;
  orderId: number;
  title?: string;
  onSuccess?: () => void;
}

const defaultDescription: { [key in OrderStatus]: string } = {
  [OrderStatus.PENDING]: "Xác nhận đơn hàng",
  [OrderStatus.PAID]: "Đơn hàng đã được thanh toán",
  [OrderStatus.PROCESSING]: "Đơn hàng đang được xử lý",
  [OrderStatus.SHIPPING]: "Đơn hàng đang được vận chuyển",
  [OrderStatus.DONE]: "Đơn hàng đã hoàn thành",
  [OrderStatus.CANCELED]: "Đơn hàng đã bị hủy",
};

export default function ChangeOrderStatusForm({
  currentStatus,
  orderId,
  title,
  onSuccess,
}: Props) {
  //   const { closeModal } = useModalActions();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: (currentStatus + 1) % 6, // Next status
      desc: defaultDescription[((currentStatus + 1) % 6) as OrderStatus] || "",
    },
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();
  const { mutate: changeOrderStatusMutate } = useMutation({
    mutationFn: async (data: { status: OrderStatus; desc: string }) =>
      orderService.admin.changeStatus({ ...data, orderId }),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      //   closeModal();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          changeOrderStatusMutate({ status: data.status, desc: data.desc });
        })}
        className="bg-white flex flex-col gap-4 min-w-fit w-full p-4 relative"
      >
        <p className="text-lg font-semibold">{title}</p>
        <FormField
          name="status"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>Trạng thái mới</FormLabel>
              <FormControl>
                <AppSelector
                  data={ORDER_STATUS_OPTIONS.map((item) => ({
                    value: item.value.toString(),
                    label: item.label,
                  }))}
                  disableValues={[currentStatus.toString()]}
                  defaultValue={form.getValues("status").toString()}
                  onValueChange={(value) => {
                    form.setValue("status", Number(value) as OrderStatus);
                    form.setValue(
                      "desc",
                      defaultDescription[Number(value) as OrderStatus] || ""
                    );
                  }}
                  //   disableOutsideClick
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="desc"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <NotebookPen />
                  </InputGroupAddon>
                  <InputGroupInput {...field} />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Cập nhật</Button>
      </form>
    </Form>
  );
}
