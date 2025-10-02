import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import env from "@/constants/env";
import { ROUTE } from "@/constants/routes";
import { formatPrice } from "@/utils/number";
import Link from "next/link";
import React from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    posterUrl: string;
    price: number;
    slug: string;
  };
}

export default function ProductCard({
  product: { name, posterUrl, price, slug },
}: ProductCardProps) {
  return (
    <Link
      target="_blank"
      href={`${ROUTE.product}/${slug}`}
      className="flex flex-col space-y-3 rounded-sm cursor-pointer bg-white border py-2 px-3 hover:border-primary"
    >
      <div className="w-full h-36">
        <SafeImage
          src={`${env.NEXT_PUBLIC_FILE_URL}/${posterUrl}`}
          alt={name}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        ></SafeImage>
      </div>
      <ClampText
        text={name}
        lines={2}
        className="hover:text-primary text-sm"
      ></ClampText>
      <p className="font-bold mt-auto">{formatPrice(price) + "đ"}</p>
    </Link>
  );
}
