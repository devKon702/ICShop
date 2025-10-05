import { formatPrice } from "@/utils/price";
import React from "react";

interface ProductWholesaleTableProps {
  detail: {
    min: number;
    price: number;
    desc: string;
  }[];
  unit: string;
}

export default function ProductWholesaleTable({
  detail,
  unit,
}: ProductWholesaleTableProps) {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="bg-primary">
          <th className="text-start px-2 py-1 border">Số lượng ({unit})</th>
          <th className="text-start px-2 py-1 border">Giá</th>
        </tr>
      </thead>
      <tbody>
        {detail.map((item) => (
          <tr key={item.min}>
            <td className="px-2 py-1 border-2">{item.desc}</td>
            <td className="px-2 py-1 border-2">{formatPrice(item.price)} đ</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
