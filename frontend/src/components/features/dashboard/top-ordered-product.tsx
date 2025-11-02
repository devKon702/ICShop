import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import env from "@/constants/env";
import statisticsService from "@/libs/services/statistics.service";
import { useModalActions } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function TopOrderedProduct() {
  const { openModal } = useModalActions();
  const { data } = useQuery({
    queryKey: ["statistics", "product", "best-sellers"],
    queryFn: async () => statisticsService.getBestSellingProducts({ limit: 5 }),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.data.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center space-x-2 w-full"
          >
            <SafeImage
              src={env.NEXT_PUBLIC_FILE_URL + "/" + item.product.posterUrl}
              width={50}
              height={50}
              alt={item.product.name}
              className="rounded-md"
            />
            <div className="flex flex-col flex-1">
              <ClampText
                lines={1}
                text={item.product.name}
                className="hover:underline cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "productDetail",
                    props: { productId: item.product.id },
                  })
                }
              />
              <span className="text-sm text-muted-foreground ml-auto hover:underline cursor-pointer">
                {`${item.totalQuantity}/${item.totalOrder} đơn hàng`}{" "}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
