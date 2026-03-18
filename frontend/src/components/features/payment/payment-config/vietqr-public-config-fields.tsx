import CustomInput from "@/components/common/custom-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PaymentType } from "@/constants/enums";
import { VietQrPublicConfigSchema } from "@/libs/schemas/payment/vietqr.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  onChange: (data: z.infer<typeof VietQrPublicConfigSchema>) => void;
  showError: boolean;
}

const ConfigFields = {
  accountHolderName: {
    label: "Tên",
    inputType: "text",
    name: "accountHolderName",
  },
  accountNumber: { label: "STK", inputType: "number", name: "accountNumber" },
  bankCode: { label: "Mã ngân hàng", inputType: "text", name: "bankCode" },
  bankName: { label: "Tên ngân hàng", inputType: "text", name: "bankName" },
  description: { label: "Mô tả", inputType: "text", name: "description" },
} satisfies Record<
  Exclude<keyof z.infer<typeof VietQrPublicConfigSchema>, "type">,
  {
    label: string;
    inputType: "text" | "number" | "password";
    name: keyof z.infer<typeof VietQrPublicConfigSchema>;
  }
>;

function VietQrPublicConfigFields({ onChange, showError }: Props) {
  const form = useForm({
    resolver: zodResolver(VietQrPublicConfigSchema),
    defaultValues: {
      type: PaymentType.VietQR,
    },
    mode: "all",
  });
  return (
    <Form {...form}>
      <form className="flex flex-col gap-2">
        {Object.entries(ConfigFields).map(([key, value]) => (
          <FormField
            key={key}
            control={form.control}
            name={value.name}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{value.label}</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      onChange(form.getValues());
                    }}
                    isError={showError && fieldState.invalid}
                    type={value.inputType}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}

export default VietQrPublicConfigFields;
