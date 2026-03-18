import AppSelector from "@/components/common/app-selector";
import CustomInput from "@/components/common/custom-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PaymentType } from "@/constants/enums";
import paymentService from "@/libs/services/payment.service";
import { useModalActions } from "@/store/modal-store";
import { createErrorHandler } from "@/utils/response-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  code: z.nativeEnum(PaymentType, {
    message: "Loại phương thức thanh toán không hợp lệ",
  }),
  name: z.string().trim().nonempty(),
  desc: z.string().trim(),
  isActive: z.boolean().default(true),
  position: z.number().default(1),
});

function CreatePaymentMethodForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: PaymentType.VietQR,
      isActive: true,
      position: 1,
    },
    mode: "onSubmit",
  });
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      paymentService.admin.createMethod(data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      closeModal();
    },
    onError: (error) => {
      const handler = createErrorHandler(
        {},
        { API: (message) => toast.error(message) },
      );
      handler(error);
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          mutate(data);
        })}
        className="flex flex-col gap-2 p-2 bg-white min-w-[50dvw]"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã</FormLabel>
              <FormControl>
                <AppSelector
                  data={
                    [{ label: "Việt QR", value: PaymentType.VietQR }] as const
                  }
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tên hiển thị</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="text"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="text"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <AppSelector
                  data={
                    [
                      { label: "Kích hoạt", value: "1" },
                      { label: "Ẩn", value: "0" },
                    ] as const
                  }
                  defaultValue={field.value ? "1" : "0"}
                  onValueChange={(value) => field.onChange(!!Number(value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Vị trí</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="number"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="flex items-center justify-center ms-auto">
          <PlusIcon /> <span>Tạo</span>
        </Button>
      </form>
    </Form>
  );
}

export default CreatePaymentMethodForm;
