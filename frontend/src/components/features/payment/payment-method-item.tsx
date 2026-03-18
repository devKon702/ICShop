import PaymentConfigItem from "@/components/features/payment/payment-config-item";
import { PaymentEnvironment, PaymentType } from "@/constants/enums";
import { PaymentPublicConfigSchema } from "@/libs/schemas/payment/payment.schema";
import paymentService from "@/libs/services/payment.service";
import { useModalActions } from "@/store/modal-store";
import { formatTimeAgo } from "@/utils/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  data: {
    id: number;
    code: PaymentType;
    name: string;
    desc: string;
    updateAt: Date;
    isActive: boolean;
    position: number;
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

  const queryClient = useQueryClient();
  const { mutate: deleteMethod } = useMutation({
    mutationFn: async () => paymentService.admin.deleteMethod(data.id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="bg-background p-2 rounded-md flex items-start space-x-4 w-full relative">
      <div className="size-12 text-2xl flex justify-center items-center bg-primary/20 rounded-sm shadow-sm text-primary font-semibold">
        {data.code.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex flex-col space-y-1 flex-1">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <p className="font-semibold">{data.name}</p>
            {data.isActive ? (
              <span className="bg-green-400 text-white font-semibold rounded-full px-2 py-1 h-fit text-xs">
                Active
              </span>
            ) : (
              <span className="bg-background rounded-full font-semibold text-black/50 px-2 py-1 text-xs">
                Inactive
              </span>
            )}
            <p className="font-semibold space-x-2 text-xs">
              <span>Updated:</span>
              <span className="opacity-50">{formatTimeAgo(data.updateAt)}</span>
            </p>
          </div>
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
            <button
              className="p-2 rounded-sm cursor-pointer bg-white"
              onClick={() => {
                openModal({
                  type: "updatePaymentMethod",
                  props: {
                    id: data.id,
                    defaultValues: {
                      code: data.code,
                      desc: data.desc,
                      isActive: data.isActive,
                      name: data.name,
                      position: data.position,
                    },
                  },
                });
              }}
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              className="p-2 rounded-sm cursor-pointer bg-red-400/10 text-red-400"
              onClick={() => {
                if (
                  confirm(
                    "Xác nhận muốn xóa phương thức thanh toán " + data.name,
                  )
                ) {
                  deleteMethod();
                }
              }}
            >
              <TrashIcon className="size-4" />
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
            <PaymentConfigItem
              key={item.id}
              data={item}
              paymentType={data.code}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodItem;
