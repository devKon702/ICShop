import { IncomeChart } from "@/components/features/admin/chart/income-chart";
import { OrderChart } from "@/components/features/admin/chart/order-chart";
import { OrderTypePieChart } from "@/components/features/admin/chart/order-type-chart";
import TopProduct from "@/components/features/admin/rank-table/top-product";
import SummaryCard from "@/components/features/admin/summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, SquareMenu, Truck, Wallet } from "lucide-react";
import React from "react";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-4 space-x-4">
        <SummaryCard
          icon={
            <div className="bg-blue-50 rounded-md p-2">
              <SquareMenu className="text-blue-400" />
            </div>
          }
          title="Đơn hàng"
          value="230"
        ></SummaryCard>
        <SummaryCard
          icon={
            <div className="bg-green-50 rounded-md p-2">
              <Wallet className="text-green-400" />
            </div>
          }
          title="Thu nhập"
          value="1.298.000 VNĐ"
        ></SummaryCard>
        <SummaryCard
          icon={
            <div className="bg-orange-50 rounded-md p-2">
              <Clock className="text-orange-400" />
            </div>
          }
          title="Đang chờ"
          value="5"
        ></SummaryCard>
        <SummaryCard
          icon={
            <div className="bg-slate-100 rounded-md p-2">
              <Truck className="text-slate-500" />
            </div>
          }
          title="Đang giao"
          value="8"
        ></SummaryCard>
      </section>
      <section className="flex space-x-4">
        <div className="w-2/3 flex flex-col space-y-4">
          <IncomeChart />
          <div className="flex space-x-4">
            <div className="w-1/2">
              <OrderChart />
            </div>
            <div className="w-1/2">
              <OrderTypePieChart />
            </div>
          </div>
        </div>
        <div className="w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <TopProduct></TopProduct>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm xem nhiều</CardTitle>
            </CardHeader>
            <CardContent>
              <TopProduct></TopProduct>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
