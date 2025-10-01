import React from "react";

interface ProductAttributeTableProps {
  attributes: { id: number; name: string; value: string }[];
}

export default function ProductAttributeTable({
  attributes,
}: ProductAttributeTableProps) {
  return (
    <table className="w-full">
      <tbody>
        {attributes.map((item) => (
          <tr key={item.id} className="grid grid-cols-2 hover:bg-primary-light">
            <td className="border font-bold px-2 py-1">{item.name}</td>
            <td className="border px-2 py-1">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
