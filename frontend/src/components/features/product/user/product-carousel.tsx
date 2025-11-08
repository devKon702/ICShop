import ProductCard from "@/components/features/product/user/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";

interface Props {
  products: {
    id: number;
    name: string;
    price: number;
    posterUrl: string | null;
    slug: string;
  }[];
}

export default function ProductCarousel({ products }: Props) {
  return (
    <Carousel>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-1/5">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
