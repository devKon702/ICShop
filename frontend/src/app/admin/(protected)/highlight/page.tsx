"use client";
import ProductHighlightItem from "@/components/features/product/admin/product-highlight-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HIGHLIGHT_OPTIONS } from "@/constants/enum-options";
import { HighlightType } from "@/constants/enums";
import highlightService from "@/libs/services/highlight.service";
import { TabsContent } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function HighlightPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "highlights"],
    queryFn: async () => highlightService.admin.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading highlights.</div>;
  }
  return (
    <Tabs className="space-y-4" defaultValue={data?.data[0].type}>
      <TabsList className="flex bg-white w-full justify-center border-b-2">
        {data?.data.map((highlight) => (
          <TabsTrigger
            key={highlight.type}
            value={highlight.type}
            className="cursor-pointer p-4 rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:font-semibold data-[state=active]:bg-primary/10 data-[state=active]:text-primary uppercase"
          >
            {
              HIGHLIGHT_OPTIONS.find(
                (option) => option.value === highlight.type
              )?.label
            }
          </TabsTrigger>
        ))}
      </TabsList>
      {data?.data.map((highlight) => (
        <TabsContent key={highlight.type} value={highlight.type}>
          <Carousel
            className="w-full"
            opts={{
              align: "start",
            }}
          >
            <CarouselContent>
              {highlight.list.map((item) => (
                <CarouselItem key={item.id} className="basis-1/4 ">
                  <ProductHighlightItem
                    highlight={{
                      id: item.id,
                      type: item.type as HighlightType,
                    }}
                    product={{
                      id: item.product.id,
                      name: item.product.name,
                      price: Number(item.product.price),
                      posterUrl: item.product.posterUrl || "",
                      categoryName: item.product.category.name,
                      isActive: item.product.isActive,
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </TabsContent>
      ))}
    </Tabs>
  );
}
