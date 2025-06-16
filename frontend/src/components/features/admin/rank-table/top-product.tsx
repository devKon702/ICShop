import Image from "next/image";
import React from "react";

const data = [
  {
    id: 1,
    image: "/uploads/ic.jpg",
    name: "IC - Bo mạch",
    sellQuantity: 92,
    orderQuantity: 39,
  },
  {
    id: 2,
    image: "/uploads/ic.jpg",
    name: "IC - Bo mạch",
    sellQuantity: 92,
    orderQuantity: 39,
  },
  {
    id: 3,
    image: "/uploads/ic.jpg",
    name: "IC - Bo mạch",
    sellQuantity: 92,
    orderQuantity: 39,
  },
  {
    id: 4,
    image: "/uploads/ic.jpg",
    name: "IC - Bo mạch",
    sellQuantity: 92,
    orderQuantity: 39,
  },
];

export default function TopProduct() {
  return (
    <ul className="space-y-2">
      {data.map((item) => (
        <li key={item.id} className="w-full flex space-x-2 items-center">
          <Image
            src={item.image}
            width={50}
            height={50}
            alt={item.name}
            className="size-11"
          />
          <span className="font-medium">{item.name}</span>
          <span className="ms-auto">{item.sellQuantity}</span>
        </li>
      ))}
    </ul>
  );
}
