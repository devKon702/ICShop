import SafeImage from "@/components/common/safe-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import env from "@/constants/env";
import statisticsService from "@/libs/services/statistics.service";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function TopOrderUser() {
  const { data } = useQuery({
    queryKey: ["statistics", "order", "top-users"],
    queryFn: async () =>
      statisticsService.getTopUsersByOrders({ limit: 5, sortBy: "desc" }),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Người dùng đặt hàng nhiều nhất</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.data.map((item, index) => (
          <div
            key={item.user.id}
            className="flex items-center space-x-2 w-full"
          >
            <span className="font-medium">{index + 1}</span>

            <SafeImage
              key={
                item.user.avatarUrl
                  ? env.NEXT_PUBLIC_FILE_URL + "/" + item.user.avatarUrl
                  : `https://ui-avatars.com/api/?name=${item.user.name}`
              }
              src={
                item.user.avatarUrl
                  ? env.NEXT_PUBLIC_FILE_URL + "/" + item.user.avatarUrl
                  : `https://ui-avatars.com/api/?name=${item.user.name}`
              }
              width={50}
              height={50}
              alt={item.user.name}
              className="rounded-md"
            />
            <div className="flex flex-col flex-1">
              <span className="font-medium">{item.user.name}</span>
              <div className="flex space-x-2 items-center">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Mail className="p-1" />
                  <span>{item.user.account.email}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Phone className="p-1" />
                  <span>{item.user.phone ?? "-"}</span>
                </div>
                <div
                  className="ml-auto text-sm text-muted-foreground hover:underline cursor-pointer"
                  onClick={() => toast.info("Đang phát triển")}
                >
                  <span>{item.orderCount} đơn</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
