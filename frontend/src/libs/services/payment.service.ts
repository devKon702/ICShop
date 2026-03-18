import { PaymentEnvironment, PaymentType } from "@/constants/enums";
import apiAxios from "@/libs/api/api-axios";
import {
  PaymentConfigSchema,
  PaymentMethodSchema,
  PaymentPrivateConfigSchema,
  PaymentPublicConfigSchema,
  SafePaymentConfigSchema,
  SafePaymentMethodSchema,
} from "@/libs/schemas/payment/payment.schema";
import { ApiResponseSchema } from "@/libs/schemas/response.schema";
import { axiosHandler } from "@/utils/response-handler";
import { z } from "zod";

const path = "/v1/payments";
const adminPath = "/v1/admin/payments";

const paymentService = {
  user: {
    getPayments: () =>
      axiosHandler(
        apiAxios.get(path),
        ApiResponseSchema(
          z.array(
            SafePaymentMethodSchema.extend({
              paymentConfigs: z.array(SafePaymentConfigSchema),
            }),
          ),
        ),
      ),
  },
  admin: {
    getPayments: () => {
      return axiosHandler(
        apiAxios.get(adminPath),
        ApiResponseSchema(
          z.array(
            PaymentMethodSchema.extend({
              paymentConfigs: z.array(
                PaymentConfigSchema.omit({
                  privateConfig: true,
                }),
              ),
            }),
          ),
        ),
      );
    },
    createMethod: (input: {
      code: PaymentType;
      name: string;
      desc: string;
      isActive?: boolean;
      position?: number;
    }) => {
      return axiosHandler(
        apiAxios.post(adminPath, input),
        ApiResponseSchema(PaymentMethodSchema),
      );
    },

    createConfig: (input: {
      paymentMethodId: number;
      environment: PaymentEnvironment;
      publicConfig: z.infer<typeof PaymentPublicConfigSchema>;
      privateConfig: z.infer<typeof PaymentPrivateConfigSchema>;
      isActive?: boolean;
    }) => {
      return axiosHandler(
        apiAxios.post(adminPath + "/configs", input),
        ApiResponseSchema(PaymentConfigSchema),
      );
    },

    updateMethod: (
      id: number,
      input: {
        code: PaymentType;
        name: string;
        desc: string;
        isActive: boolean;
        position: number;
      },
    ) => {
      return axiosHandler(
        apiAxios.patch(`${adminPath}/${id}`, input),
        ApiResponseSchema(PaymentMethodSchema),
      );
    },

    updateConfig: (
      id: number,
      input: {
        paymentMethodId: number;
        environment: PaymentEnvironment;
        publicConfig: z.infer<typeof PaymentPublicConfigSchema>;
        privateConfig: z.infer<typeof PaymentPrivateConfigSchema>;
        isActive: boolean;
      },
    ) => {
      return axiosHandler(
        apiAxios.patch(`${adminPath}/configs/${id}`, input),
        ApiResponseSchema(PaymentConfigSchema),
      );
    },

    deleteMethod: (id: number) => {
      return axiosHandler(
        apiAxios.delete(`${adminPath}/${id}`),
        ApiResponseSchema(z.null()),
      );
    },

    deleteConfig: (id: number) => {
      return axiosHandler(
        apiAxios.delete(`${adminPath}/configs${id}`),
        ApiResponseSchema(z.null()),
      );
    },
  },
};

export default paymentService;
