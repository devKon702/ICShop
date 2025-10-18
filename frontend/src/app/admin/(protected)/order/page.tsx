"use client";

import React from "react";
import AdminOrderTable from "@/components/features/order/admin/admin-order-table";
import AdminOrderFilterBar from "@/components/features/order/admin/admin-order-filter-bar";

export default function AdminOrderPage() {
  return (
    <div className="space-y-6">
      <AdminOrderFilterBar />
      <AdminOrderTable />
    </div>
  );
}
