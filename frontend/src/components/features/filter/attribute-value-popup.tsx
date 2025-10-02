"use client";
import { useAttributeFilterContext } from "@/libs/contexts/AttributeFilterContext";
import { useFilter } from "@/libs/hooks/useFilter";
import React from "react";

type AttributeValueType = {
  id: number;
  value: string;
  attribute: { id: number; name: string };
};

interface AttributeValueProps {
  values: AttributeValueType[];
}

export default function AttributeValuePopup({ values }: AttributeValueProps) {
  const [search, setSearch] = React.useState("");
  const {
    selectedAttributeValues: selectedAttributes,
    toggleAttributeValues: toggleAttribute,
  } = useAttributeFilterContext();
  const filteredData = useFilter<AttributeValueType, string>(
    values,
    (item, query) =>
      item.value.toLowerCase().includes(query.trim().toLowerCase()),
    search
  );

  return (
    <div>
      <div className="border-2 border-gray-500 rounded-xl flex items-center justify-between p-1 px-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm"
          className="outline-none border-none"
        />
        <i className="bx bx-search"></i>
      </div>

      <ul className="p-2 space-y-2">
        {filteredData.map((item) => (
          <li
            key={item.id}
            className={`border-s-2 border-s-transparent ${
              selectedAttributes.some((val) => val.id === item.id)
                ? "border-primary text-primary"
                : ""
            } cursor-pointer`}
            onClick={() =>
              toggleAttribute({
                id: item.id,
                value: item.value,
                attribute: { id: item.attribute.id, name: item.attribute.name },
              })
            }
          >
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
