import { formatPrice } from "@/utils/number";
import React from "react";

export default function ProductWholesaleTable() {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="bg-primary">
          <th className="text-start px-2 py-1">Số lượng</th>
          <th className="text-start px-2 py-1">Giá</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-2 py-1 border-2">10+</td>
          <td className="px-2 py-1 border-2">{formatPrice(99000)}</td>
        </tr>
        <tr>
          <td className="px-2 py-1 border-2">20+</td>
          <td className="px-2 py-1 border-2">{formatPrice(89000)}</td>
        </tr>
        <tr>
          <td className="px-2 py-1 border-2">30+</td>
          <td className="px-2 py-1 border-2">{formatPrice(79000)}</td>
        </tr>
        <tr>
          <td className="px-2 py-1 border-2">40+</td>
          <td className="px-2 py-1 border-2">{formatPrice(69000)}</td>
        </tr>
      </tbody>
    </table>
  );
}
