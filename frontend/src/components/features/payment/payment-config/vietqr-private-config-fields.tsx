import { Form } from "@/components/ui/form";
import { PaymentType } from "@/constants/enums";
import { VietQrPrivateConfigSchema } from "@/libs/schemas/payment/vietqr.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  onChange: (data: z.infer<typeof VietQrPrivateConfigSchema>) => void;
  showError: boolean;
  defaultValue?: z.infer<typeof VietQrPrivateConfigSchema>;
}

function VietQrPrivateConfigFields({}: Props) {
  const form = useForm({
    resolver: zodResolver(VietQrPrivateConfigSchema),
    defaultValues: {
      type: PaymentType.VietQR,
    },
    mode: "all",
  });
  return (
    <Form {...form}>
      <form></form>
    </Form>
  );
}

export default VietQrPrivateConfigFields;
