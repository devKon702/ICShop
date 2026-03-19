import ProductCarousel from "@/components/features/product/user/product-carousel";
import React from "react";

interface Props {
  collection: {
    id: number;
    name: string;
    desc: string;
    slug: string;
    products: Array<{
      id: number;
      name: string;
      price: number;
      posterUrl: string | null;
      slug: string;
    }>;
  };
}

export default function CollectionCarousel({ collection }: Props) {
  return (
    <article className="p-4 rounded-md border shadow bg-white">
      <h2 className="font-semibold text-lg">{collection.name}</h2>
      <p className="font-semibold text-sm opacity-50 mb-2">{collection.desc}</p>
      <ProductCarousel products={collection.products} />
    </article>
  );
}
