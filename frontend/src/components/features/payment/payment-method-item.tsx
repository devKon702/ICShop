import PaymentConfigItem from "@/components/features/payment/payment-config-item";
import { PaymentEnvironment, PaymentType } from "@/constants/enums";
import { PaymentPublicConfigSchema } from "@/libs/schemas/payment/payment.schema";
import { useModalActions } from "@/store/modal-store";
import { PencilIcon, PlusIcon } from "lucide-react";
import React from "react";
import { z } from "zod";

interface Props {
  data: {
    id: number;
    code: PaymentType;
    name: string;
    desc: string;
    updateAt: Date;
    isActive: boolean;
    configs: {
      id: number;
      environment: PaymentEnvironment;
      publicConfig: z.infer<typeof PaymentPublicConfigSchema>;
      isActive: boolean;
      updatedAt: Date;
    }[];
  };
}

function PaymentMethodItem({ data }: Props) {
  const { openModal } = useModalActions();
  return (
    <div className="bg-background p-2 rounded-md flex items-start space-x-4 w-full relative">
      <div className="size-12 text-2xl flex justify-center items-center bg-primary/20 rounded-sm shadow-sm text-primary font-semibold">
        {data.code.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex flex-col space-y-1 flex-1">
        <div className="flex justify-between">
          <p className="font-semibold">{data.name}</p>
          <div className="absolute flex space-x-2 items-center top-2 right-2">
            <button
              className="flex rounded-sm items-center space-x-2 p-2 cursor-pointer bg-primary/80 text-white"
              onClick={() =>
                openModal({
                  type: "createPaymentConfig",
                  props: { paymentType: data.code, methodId: data.id },
                })
              }
            >
              <PlusIcon className="size-4" />
              <span className="text-xs">Thêm cấu hình</span>
            </button>
            <button className="p-2 rounded-sm cursor-pointer bg-white">
              <PencilIcon className="size-4" />
            </button>
          </div>
        </div>
        <p className="text-sm font-semibold opacity-50">{data.desc}</p>
        <div className="flex space-x-2 items-center">
          <span className="font-semibold">Môi trường:</span>
          {data.configs.some(
            (item) => item.environment === PaymentEnvironment.SANDBOX,
          ) ? (
            <span className="font-semibold text-sm opacity-50">Sandbox,</span>
          ) : null}
          {data.configs.some(
            (item) => item.environment === PaymentEnvironment.PRODUCTION,
          ) ? (
            <span className="font-semibold text-sm opacity-50">Production</span>
          ) : null}
        </div>
        <div className="flex flex-col space-y-2">
          {data.configs.map((item) => (
            <PaymentConfigItem key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodItem;
