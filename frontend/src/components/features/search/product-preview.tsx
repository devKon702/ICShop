import ClampText from "@/components/common/clamp-text";
import { formatPrice } from "@/utils/number";
import Image from "next/image";
import React from "react";

interface ProductPreviewProps {
  id: number;
  img: string;
  name: string;
  price: number;
}

export default function ProductPreview({
  img,
  name,
  price,
}: ProductPreviewProps) {
  return (
    <div className="flex cursor-pointer hover:bg-">
      <Image src={img} alt={name} width={40} height={40}></Image>
      <ClampText text={name} lines={1}></ClampText>
      <span>{formatPrice(price) + "đ"}</span>
    </div>
  );
}
