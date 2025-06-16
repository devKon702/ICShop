import ClampText from "@/components/common/clamp-text";
import { ROUTE } from "@/constants/routes";
import { Product } from "@/libs/models/product";
import { formatPrice } from "@/utils/number";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product: { name, images, activeWholesale, slug },
}: ProductCardProps) {
  return (
    <Link
      target="_blank"
      href={`${ROUTE.product}/${slug}`}
      className="flex flex-col space-y-3 rounded-sm cursor-pointer bg-white border py-2 px-3 hover:border-primary"
    >
      <div className="w-full h-36">
        <Image
          src={`/uploads/${images?.at(0)?.imageUrl}`}
          alt={name}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        ></Image>
      </div>
      <ClampText
        text={name}
        lines={2}
        className="hover:text-primary"
      ></ClampText>
      <p className="font-bold mt-auto">
        {formatPrice(activeWholesale?.details?.at(0)?.price) + "đ"}
      </p>
    </Link>
  );
}
