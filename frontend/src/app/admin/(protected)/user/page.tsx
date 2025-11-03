"use client";

import React from "react";
import AccountTable from "@/components/features/account/account-table";
import { useQuery } from "@tanstack/react-query";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import accountService from "@/libs/services/account.service";
import AppPagination from "@/components/common/app-pagination";
import AppSelector from "@/components/common/app-selector";
import CustomInput from "@/components/common/custom-input";
import { Filter, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const sortOptions = [
  { value: "created-asc", label: "Ngày tạo (Cũ nhất)" },
  { value: "created-desc", label: "Ngày tạo (Mới nhất)" },
  { value: "name-asc", label: "Tên (A-Z)" },
  { value: "name-desc", label: "Tên (Z-A)" },
] as const;

export default function AdminUserPage() {
  const [filters, setFilters] = React.useState<{
    email?: string;
    name?: string;
    phone?: string;
    sortBy: (typeof sortOptions)[number]["value"];
  }>({ sortBy: "created-desc" });

  const [query, setQuery] = useQueryStates({
    email: parseAsString,
    name: parseAsString,
    phone: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    sortBy: parseAsStringLiteral(
      sortOptions.map((option) => option.value)
    ).withDefault("created-desc"),
  });

  const { data } = useQuery({
    queryKey: ["accounts", { ...query }],
    queryFn: async () =>
      accountService.filter({
        email: query.email ?? undefined,
        name: query.name ?? undefined,
        phone: query.phone ?? undefined,
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
      }),
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col ">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <CustomInput
            isError={false}
            type="text"
            icon={<Mail className="p-1" />}
            className="border px-2 py-1 rounded-md"
            placeholder="Tìm theo email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
          <CustomInput
            isError={false}
            type="text"
            icon={<User className="p-1" />}
            className="border px-2 py-1 rounded-md"
            placeholder="Tìm theo tên"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <CustomInput
            isError={false}
            type="number"
            icon={<Phone className="p-1" />}
            className="border px-2 py-1 rounded-md"
            placeholder="Tìm theo SĐT"
            value={filters.phone}
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          />

          <AppSelector
            data={sortOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, sortBy: val }))
            }
            defaultValue={query.sortBy ?? undefined}
          />
        </div>
        <Button
          className="flex ml-auto"
          onClick={() => {
            setQuery({
              ...query,
              page: 1,
              name: filters.name?.trim() || null,
              email: filters.email?.trim() || null,
              phone: filters.phone?.trim() || null,
              sortBy: filters.sortBy,
            });
          }}
        >
          <Filter />
          <span>Lọc</span>
        </Button>
      </div>
      {data && (
        <>
          <AccountTable
            accounts={data.data.result.map((item) => ({
              id: item.id,
              email: item.email,
              createdAt: new Date(item.createdAt),
              user: {
                id: item.id,
                name: item.user.name,
                phone: item.user.phone,
                avatarUrl: item.user.avatarUrl,
              },
              isActive: item.isActive,
            }))}
          />

          <AppPagination
            currentPage={data?.data.page}
            totalPage={Math.ceil(data?.data.total / data?.data.limit)}
            isClientSide
          />
        </>
      )}
    </div>
  );
}
