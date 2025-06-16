import React from "react";

const data = [
  { id: 1, name: "Loại", value: "Board" },
  { id: 2, name: "Điện áp cấp", value: "5V" },
  { id: 3, name: "Tích hợp bluetooth", value: "Không" },
  { id: 4, name: "Vi xử lí chính", value: "ESP8266" },
];

export default function ProductAttributeTable() {
  return (
    <table className="w-full">
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="grid grid-cols-2 hover:bg-primary-light">
            <td className="border font-bold px-2 py-1">{item.name}</td>
            <td className="border px-2 py-1">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
