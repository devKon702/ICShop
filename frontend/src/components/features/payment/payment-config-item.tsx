import { PaymentEnvironment, PaymentType } from "@/constants/enums";
import { PaymentPublicConfigSchema } from "@/libs/schemas/payment/payment.schema";
import { VietQrPublicConfigSchema } from "@/libs/schemas/payment/vietqr.schema";
import { formatTimeAgo } from "@/utils/date";
import { PencilIcon } from "lucide-react";
import React from "react";
import { z } from "zod";

type FieldConfig<T> = {
  name: keyof T;
  label: string;
};

const vietQr: FieldConfig<z.infer<typeof VietQrPublicConfigSchema>>[] = [
  { name: "bankCode", label: "Ngân hàng" },
  { name: "accountNumber", label: "STK" },
  { name: "accountHolderName", label: "Tên" },
];

const configUI = {
  [PaymentType.VietQR]: vietQr,
} as const;

interface Props {
  data: {
    id: number;
    publicConfig: z.infer<typeof PaymentPublicConfigSchema>;
    environment: PaymentEnvironment;
    isActive: boolean;
    updatedAt: Date;
  };
}

function PaymentConfigItem({ data }: Props) {
  const configFields = configUI[data.publicConfig.type];
  return (
    <div className="bg-white rounded-md p-2 gap-2 w-full text-sm flex items-center justify-between">
      <div className="flex flex-col space-y-1">
        <div className="flex space-x-2 items-center">
          {data.isActive ? (
            <div className="bg-green-400 text-white font-semibold rounded-full px-2 py-1 text-xs">
              Active
            </div>
          ) : (
            <div className="bg-background rounded-full font-semibold text-black/50 px-2 py-1 text-xs">
              Inactive
            </div>
          )}
          <p className="font-semibold opacity-50">
            {data.environment === PaymentEnvironment.SANDBOX
              ? "Sandbox"
              : "Production"}
          </p>
          <div className="flex items-center gap-2 ms-2 text-xs">
            <span className="font-semibold">Updated:</span>
            <span className="font-semibold opacity-50">
              {formatTimeAgo(data.updatedAt)}
            </span>{" "}
          </div>
        </div>
        <div className="flex space-x-4">
          {configFields.map((item, index) => (
            <div key={index}>
              <span className="font-semibold me-1">{item.label}:</span>
              <span className="font-semibold opacity-50">
                {data.publicConfig[item.name]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button className="p-2 bg-background cursor-pointer rounded-md">
        <PencilIcon className="size-4" />
      </button>
    </div>
  );
}

export default PaymentConfigItem;
