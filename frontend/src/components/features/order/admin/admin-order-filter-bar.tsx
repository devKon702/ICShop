import AppSelector from "@/components/common/app-selector";
import DateRangeSelector from "@/components/common/date-range-selector";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { OrderStatus } from "@/constants/enums";
import { ORDER_STATUS_OPTIONS } from "@/constants/enum-options";
import { getDaysAgo, getStartOfDay } from "@/utils/date";
import { Filter, Mail, NotepadText, Phone } from "lucide-react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import React from "react";

export default function AdminOrderFilterBar() {
  const [query, setQuery] = useQueryStates({
    code: parseAsString,
    receiverPhone: parseAsString,
    email: parseAsString,
    from: parseAsIsoDate.withDefault(getDaysAgo(30)),
    to: parseAsIsoDate.withDefault(getStartOfDay(new Date())),
    sortBy: parseAsStringLiteral(["create_asc", "create_desc"]).withDefault(
      "create_desc"
    ),
    isActive: parseAsBoolean,
    status: parseAsNumberLiteral([
      OrderStatus.CANCELED,
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DONE,
    ]),
    page: parseAsInteger.withDefault(1),
  });
  const [filter, setFilter] = React.useState({
    code: query.code,
    receiverPhone: query.receiverPhone,
    email: query.email,
    isActive: query.isActive,
    from: query.from,
    to: query.to,
    status: query.status,
    sortBy: query.sortBy,
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {/* Order Code */}
        <InputGroup className="px-2 flex-1">
          <InputGroupAddon>
            <NotepadText />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Mã đơn hàng"
            className="px-2 rounded-md outline-none"
            value={filter.code || ""}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, code: e.target.value || null }))
            }
          />
        </InputGroup>
        {/* Create Date Range */}
        <DateRangeSelector
          shortcutDays={[
            { days: 7, label: "1 tuần" },
            { days: 14, label: "2 tuần" },
            { days: 30, label: "1 tháng" },
          ]}
          defaultRange={{
            from: query.from,
            to: query.to,
          }}
          onChange={(range) =>
            setFilter((prev) => ({
              ...prev,
              from: range.from || prev.from,
              to: range.to || prev.to,
            }))
          }
          required
          className="h-full flex-1"
        />
        {/* Order Status */}
        <AppSelector
          data={[
            { value: "all", label: "Tất cả" },
            ...ORDER_STATUS_OPTIONS.map((item) => ({
              value: item.value.toString(),
              label: item.label,
            })),
          ]}
          defaultValue="all"
          onValueChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              status: value === "all" ? null : Number(value),
            }))
          }
          className="flex-1"
        />
        {/* Sort By */}
        <AppSelector
          data={[
            { value: "create_asc", label: "Cũ nhất" },
            { value: "create_desc", label: "Mới nhất" },
          ]}
          defaultValue="create_desc"
          onValueChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              sortBy: value as "create_asc" | "create_desc",
            }))
          }
          className=""
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <InputGroup className="px-2">
          <InputGroupAddon>
            <Phone />
          </InputGroupAddon>
          <InputGroupInput
            type="number"
            placeholder="SĐT người nhận"
            className="px-2 py-1 rounded-md outline-none"
            value={filter.receiverPhone || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                receiverPhone: e.target.value || null,
              }))
            }
          />
        </InputGroup>
        <InputGroup className="px-2">
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
          <InputGroupInput
            type="email"
            placeholder="Email người đặt"
            className="px-2 py-1 rounded-md outline-none"
            value={filter.email || ""}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, email: e.target.value || null }))
            }
          />
        </InputGroup>
        <Button
          className="w-fit ml-auto"
          onClick={(e) => {
            setQuery({ ...query, ...filter, page: 1 });
            console.log(e.target);
          }}
        >
          <Filter /> <span>Lọc</span>
        </Button>
      </div>
    </div>
  );
}
