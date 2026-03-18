import AppSelector from "@/components/common/app-selector";
import VietQrPrivateConfigFields from "@/components/features/payment/payment-config/vietqr-private-config-fields";
import VietQrPublicConfigFields from "@/components/features/payment/payment-config/vietqr-public-config-fields";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PaymentEnvironment, PaymentType } from "@/constants/enums";
import {
  PaymentPrivateConfigSchema,
  PaymentPublicConfigSchema,
} from "@/libs/schemas/payment/payment.schema";
import paymentService from "@/libs/services/payment.service";
import { useModalActions } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React, { ElementType, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  paymentMethodId: z.number().min(1, "ID không hợp lệ"),
  environment: z.enum(
    [PaymentEnvironment.PRODUCTION, PaymentEnvironment.SANDBOX],
    {
      message: "Môi trường cấu hình không hợp lệ",
    },
  ),
  publicConfig: PaymentPublicConfigSchema,
  privateConfig: PaymentPrivateConfigSchema,
  isActive: z.boolean().default(true),
});

interface Props {
  paymentType: PaymentType;
  methodId: number;
}

const FormRegistry = {
  [PaymentType.VietQR]: {
    PublicForm: VietQrPublicConfigFields,
    PrivateForm: VietQrPrivateConfigFields,
  },
} satisfies Record<
  PaymentType,
  { PublicForm: ElementType; PrivateForm: ElementType }
>;

function CreatePaymentConfigForm({ paymentType, methodId }: Props) {
  const defaultValues = {
    environment: PaymentEnvironment.SANDBOX,
    isActive: true,
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethodId: methodId,
      environment: defaultValues.environment,
      isActive: defaultValues.isActive,
      publicConfig: {
        type: paymentType,
      },
      privateConfig: {
        type: paymentType,
      },
    },
    mode: "onSubmit",
  });
  const [showConfigError, setShowConfigError] = useState(false);
  const { PublicForm, PrivateForm } = FormRegistry[paymentType];
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      paymentService.admin.createConfig(data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            mutate(data);
          },
          () => setShowConfigError(true),
        )}
        className="min-w-[60dvw] p-2 space-y-2"
      >
        <div className="flex gap-2 justify-between items-center bg-white p-2 rounded-sm">
          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Môi trường</FormLabel>
                <FormControl>
                  <AppSelector
                    data={
                      [
                        { label: "Sandbox", value: PaymentEnvironment.SANDBOX },
                        {
                          label: "Production",
                          value: PaymentEnvironment.PRODUCTION,
                        },
                      ] as const
                    }
                    defaultValue={defaultValues.environment}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Trạng thái</FormLabel>
                <FormControl>
                  <AppSelector
                    data={
                      [
                        { label: "Kích hoạt", value: "1" },
                        {
                          label: "Ẩn",
                          value: "0",
                        },
                      ] as const
                    }
                    defaultValue={defaultValues ? "1" : "0"}
                    onValueChange={(value) => field.onChange(!!Number(value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded-sm bg-white flex-1">
            <p className="font-semibold mb-2">Công khai</p>
            <PublicForm
              onChange={(data) => {
                form.setValue("publicConfig", data);
              }}
              showError={showConfigError}
            />
          </div>
          <div className="p-2 rounded-sm bg-white flex-1">
            <p className="font-semibold mb-2">Bảo mật</p>
            <PrivateForm
              onChange={(data) => form.setValue("privateConfig", data)}
              showError={showConfigError}
            />
          </div>
        </div>
        <Button className="flex ms-auto px-8">
          <PlusIcon /> <span>Tạo</span>
        </Button>
      </form>
    </Form>
  );
}

export default CreatePaymentConfigForm;
