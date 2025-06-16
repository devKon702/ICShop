"use client";
import { useFilterContext } from "@/libs/contexts/FilterContext";
import { useFilter } from "@/libs/hooks/useFilter";
import { AttributeValue } from "@/libs/models/attribute-value";
import React from "react";

interface AttributeValueProps {
  values: AttributeValue[];
}

export default function AttributeValuePopup({ values }: AttributeValueProps) {
  const [search, setSearch] = React.useState("");
  const {
    selectedAttributeValues: selectedAttributes,
    toggleAttributeValues: toggleAttribute,
  } = useFilterContext();
  // const [selectedItems, toggle] = useToggleSelect<AttributeValue>(
  //   [],
  //   (a, b) => a.id == b.id
  // );
  const filteredData = useFilter<AttributeValue, string>(
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
            onClick={() => toggleAttribute(item)}
          >
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
