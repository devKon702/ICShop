import ProductCarousel from "@/components/features/product/user/product-carousel";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { HIGHLIGHT_OPTIONS } from "@/constants/enum-options";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react";

interface Props {
  data: {
    highlightType: string;
    products: {
      id: number;
      name: string;
      price: number;
      posterUrl: string | null;
      slug: string;
    }[];
  }[];
}

export default function ProductHighlightTabs({ data }: Props) {
  return (
    <Tabs
      defaultValue={data?.at(0)?.highlightType}
      className="bg-white p-4 rounded-md shadow-md"
    >
      <TabsList className="flex items-center justify-between w-full bg-transparent">
        {data.map((option) => (
          <TabsTrigger
            key={option.highlightType}
            value={option.highlightType}
            className="cursor-pointer py-1 flex-1 border-b-2 hover:bg-primary/10 data-[state=active]:border-b-primary data-[state=active]:font-semibold data-[state=active]:bg-primary/40 text-center transition-all duration-300"
          >
            {HIGHLIGHT_OPTIONS.find((opt) => opt.value === option.highlightType)
              ?.label || option.highlightType}
          </TabsTrigger>
        ))}
      </TabsList>
      {data.map((option) => (
        <TabsContent key={option.highlightType} value={option.highlightType}>
          <ProductCarousel
            products={option.products.map((product) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              posterUrl: product.posterUrl,
              slug: product.slug,
            }))}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
