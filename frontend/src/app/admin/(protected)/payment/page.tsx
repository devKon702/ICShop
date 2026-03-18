"use client";
import AppSelector from "@/components/common/app-selector";
import PaymentMethodItem from "@/components/features/payment/payment-method-item";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PaymentEnvironment } from "@/constants/enums";
import paymentService from "@/libs/services/payment.service";
import { useModalActions } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

function PaymentPage() {
  const [filter, setFilter] = useState<{
    search: string;
    isActive: boolean | null;
  }>({ search: "", isActive: null });
  const { data } = useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentService.admin.getPayments(),
    staleTime: 5 * 60_000,
  });
  const [summaries, setSummaries] = useState<
    { title: string; quantity: number; desc: string }[]
  >([]);
  useEffect(() => {
    setSummaries([
      {
        title: "Phương thức hỗ trợ",
        quantity: data?.data.length ?? 0,
        desc: data?.data.map((item) => item.code).join(", ") ?? "",
      },
      {
        title: "Tổng số cấu hình",
        quantity:
          data?.data
            .map((item) => item.paymentConfigs.length)
            .reduce((a, b) => a + b, 0) ?? 0,
        desc: "Sandbox và Production",
      },
      {
        title: "Đang kích hoạt",
        quantity:
          data?.data
            .map((item) => item.paymentConfigs.filter((i) => i.isActive).length)
            .reduce((a, b) => a + b, 0) ?? 0,
        desc: "Cấu hình đang kích hoạt trong hệ thống",
      },
      {
        title: "Hiển thị cho khách",
        quantity:
          data?.data
            .map(
              (item) =>
                item.paymentConfigs.filter(
                  (i) =>
                    i.isActive &&
                    i.environment === PaymentEnvironment.PRODUCTION,
                ).length,
            )
            .reduce((a, b) => a + b, 0) ?? 0,
        desc: "Cấu hình đang hoạt động thực tế",
      },
    ]);
  }, [data]);
  const { openModal } = useModalActions();
  return (
    <div className="flex flex-col space-y-2">
      {/* Summary Cards */}
      <div className="flex justify-around space-x-2 w-full">
        {summaries.map((item, index) => (
          <div
            key={index}
            className="px-4 py-2 rounded-sm flex flex-col space-y-1 flex-1 bg-background shadow-sm"
          >
            <p className="font-semibold opacity-50">{item.title}</p>
            <p className="font-bold">{item.quantity}</p>
            <p className="text-xs font-semibold opacity-50">{item.desc}</p>
          </div>
        ))}
      </div>
      {/* Filter bar */}
      <div className="flex space-x-4 items-center">
        <div>
          <p className="font-semibold text-sm mb-1">Tra cứu</p>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Tên phương thức"
            />
          </InputGroup>
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">Trạng thái</p>
          <AppSelector
            data={[
              { label: "Kích hoạt", value: 1 },
              { label: "Ẩn", value: 0 },
              { label: "Tất cả", value: "all" },
            ]}
            defaultValue={"all"}
            onValueChange={(value) =>
              setFilter({
                ...filter,
                isActive: value === "all" ? null : !!value,
              })
            }
          />
        </div>
        <Button
          className="bg-primary px-4 py-2 ms-auto flex items-center"
          onClick={() => {
            openModal({ type: "createPaymentMethod", props: null });
          }}
        >
          <PlusIcon />
          <p>Thêm phương thức</p>
        </Button>
      </div>
      {/* Payment list */}
      <div className="flex flex-col space-y-2">
        {data &&
          data.data
            .filter(
              (item) =>
                item.name
                  .toLocaleLowerCase()
                  .includes(filter.search.toLowerCase()) &&
                (filter.isActive == null ||
                  item.isActive === filter.isActive ||
                  item.paymentConfigs.some(
                    (conf) => conf.isActive === filter.isActive,
                  )),
            )
            .map((item) => (
              <PaymentMethodItem
                key={item.id}
                data={{
                  id: item.id,
                  code: item.code,
                  configs: item.paymentConfigs
                    .filter((item) =>
                      filter.isActive === null
                        ? true
                        : filter.isActive === item.isActive,
                    )
                    .map((config) => ({
                      id: config.id,
                      environment: config.environment,
                      isActive: config.isActive,
                      publicConfig: config.publicConfig,
                      updatedAt: new Date(config.updatedAt),
                    })),
                  desc: item.desc,
                  isActive: item.isActive,
                  name: item.name,
                  updateAt: new Date(item.updatedAt),
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default PaymentPage;
