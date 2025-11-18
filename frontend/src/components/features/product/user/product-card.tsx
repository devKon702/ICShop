import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import env from "@/constants/env";
import { ROUTE } from "@/constants/routes";
import { formatPrice } from "@/utils/price";
import Link from "next/link";
import React from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    posterUrl: string | null;
    price: number;
    slug: string;
  };
}

export default function ProductCard({
  product: { name, posterUrl, price, slug },
}: ProductCardProps) {
  return (
    <Link
      href={`${ROUTE.product}/${slug}`}
      className="flex h-full flex-col space-y-1 rounded-lg cursor-pointer bg-white border hover:border-primary overflow-hidden"
    >
      <div className="w-full aspect-square overflow-hidden">
        <SafeImage
          src={`${env.NEXT_PUBLIC_FILE_URL}/${posterUrl}`}
          alt={name}
          width={200}
          height={200}
          className="size-full object-cover hover:scale-110 transition-all duration-300"
        />
      </div>
      <div className="flex flex-col px-2 py-1 space-y-2 flex-1">
        <ClampText
          text={name}
          lines={2}
          className="hover:text-primary text-sm font-semibold"
        />
        <p className="font-bold mt-auto ml-auto">{formatPrice(price) + " đ"}</p>
      </div>
    </Link>
  );
}
