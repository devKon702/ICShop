import ClampText from "@/components/common/clamp-text";
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
      <ClampText
        className="font-semibold text-lg"
        text={collection.name}
        lines={1}
      />
      <ClampText
        className="font-semibold text-sm opacity-50 mb-2"
        text={collection.desc}
        lines={2}
      />
      <ProductCarousel products={collection.products} />
    </article>
  );
}
