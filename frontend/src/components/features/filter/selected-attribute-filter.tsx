"use client";
import { useFilterContext } from "@/libs/contexts/FilterContext";
import { AttributeValue } from "@/libs/models/attribute-value";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function groupAttribute(values: AttributeValue[]) {
  const map = new Map<number, AttributeValue[]>();
  const nameMap = new Map<number, string>();

  for (const val of values) {
    if (!map.has(val.attributeId)) {
      map.set(val.attributeId, []);
      nameMap.set(val.attributeId, val.attribute?.name as string);
    }
    map.get(val.attributeId)!.push(val);
  }

  return Array.from(map.entries()).map(([attributeId, values]) => ({
    attributeId,
    attributeName: nameMap.get(attributeId) as string,
    values,
  }));
}

export default function SelectedAttributeValueFilter() {
  const { selectedAttributeValues, toggleAttributeValues } = useFilterContext();
  const [filteringAttributes, setFilteringAttributes] = useState<
    {
      attributeId: number;
      attributeName: string;
      values: AttributeValue[];
    }[]
  >([]);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    setFilteringAttributes(groupAttribute(selectedAttributeValues));
  }, [selectedAttributeValues]);
  // if (filteringAttributes.length == 0) return null;
  return (
    <div className="p-3 bg-white rounded-md shadow-xl text-sm">
      <ul className="space-y-3">
        {filteringAttributes.map((item) => (
          <li key={item.attributeId} className="flex items-center space-x-2">
            <span className="font-bold">{item.attributeName}:</span>
            {item.values.map((value) => (
              <span
                key={value.id}
                className="rounded-4xl border-2 bg-background px-2 py-1 cursor-pointer flex items-center"
                onClick={() => toggleAttributeValues(value)}
              >
                {value.value}
                <i className="bx bx-x ms-2 text-lg my-0"></i>
              </span>
            ))}
          </li>
        ))}
      </ul>
      <button
        className="rounded-sm bg-primary text-white cursor-pointer px-3 py-1 flex justify-between items-center ms-auto"
        onClick={() => {
          let attrids = "";
          selectedAttributeValues.forEach((item) => (attrids += item.id + ","));
          router.push(pathname + `?attrids=${attrids}&page=1&limit=10`);
        }}
      >
        <i className="bx bxs-filter-alt me-2"></i>
        Lọc
      </button>
    </div>
  );
}
