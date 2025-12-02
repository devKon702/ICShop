"use client";

import React from "react";
import AdminOrderTable from "@/components/features/order/admin/admin-order-table";
import AdminOrderFilterBar from "@/components/features/order/admin/admin-order-filter-bar";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { getDateAgo, getEndOfDay, getStartOfDay } from "@/utils/date";

export default function AdminOrderPage() {
  const [query, setQuery] = useQueryStates({
    from: parseAsIsoDateTime,
    to: parseAsIsoDateTime,
  });
  const [firstLoad, setFirstLoad] = React.useState(true);
  React.useEffect(() => {
    if (query.from && query.to) return;
    setQuery({
      from: getStartOfDay(getDateAgo("1m")),
      to: getEndOfDay(new Date()),
    });
    setFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (firstLoad) return null;
  return (
    <div className="space-y-6">
      <AdminOrderFilterBar />
      <AdminOrderTable />
    </div>
  );
}
