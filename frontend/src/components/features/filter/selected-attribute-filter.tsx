"use client";
import { useAttributeFilterContext } from "@/libs/contexts/AttributeFilterContext";
import { Trash } from "lucide-react";
import { parseAsArrayOf, parseAsInteger, useQueryStates } from "nuqs";
import React, { useEffect, useState } from "react";

function groupValues(
  values: {
    id: number;
    value: string;
    attribute: { id: number; name: string };
  }[]
) {
  const attributeGroups = new Map<number, { name: string; values: number[] }>();

  values.forEach((val) => {
    if (!attributeGroups.has(val.attribute.id)) {
      attributeGroups.set(val.attribute.id, {
        name: val.attribute.name,
        values: [val.id],
      });
    } else {
      attributeGroups.get(val.attribute.id)!.values.push(val.id);
    }
  });

  return Array.from(attributeGroups.entries()).map(
    ([attributeId, { name, values }]) => ({
      attributeId,
      attributeName: name,
      values,
    })
  );
}

export default function SelectedAttributeValueFilter() {
  const {
    selectedAttributeValues,
    toggleAttributeValues,
    changed,
    setChanged,
    resetAttributeValues,
  } = useAttributeFilterContext();
  const [done, setDone] = useState(false);
  const [filteringAttributes, setFilteringAttributes] = useState<
    {
      attributeId: number;
      attributeName: string;
      values: { id: number; value: string }[];
    }[]
  >([]);
  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      vids: parseAsArrayOf(parseAsInteger).withDefault([]),
    },
    { shallow: false }
  );
  useEffect(() => {
    // Group selected attribute values by their attribute
    setFilteringAttributes(
      groupValues(selectedAttributeValues).map((group) => ({
        attributeId: group.attributeId,
        attributeName: group.attributeName,
        values: selectedAttributeValues.filter((v) =>
          group.values.includes(v.id)
        ),
      }))
    );
    setDone(true);
  }, [selectedAttributeValues]);
  return (
    <div className="p-3 bg-white rounded-md shadow-xl text-sm">
      <ul className="space-y-3">
        {done &&
          filteringAttributes.map((item) => (
            <li key={item.attributeId} className="flex items-center space-x-2">
              <span className="font-bold">{item.attributeName}:</span>
              {item.values.map((value) => (
                <span
                  key={value.id}
                  className="rounded-4xl border-2 bg-background px-2 py-1 cursor-pointer flex items-center"
                  onClick={() =>
                    toggleAttributeValues({
                      id: value.id,
                      value: value.value,
                      attribute: {
                        id: item.attributeId,
                        name: item.attributeName,
                      },
                    })
                  }
                >
                  {value.value}
                  <i className="bx bx-x ms-2 text-lg my-0"></i>
                </span>
              ))}
            </li>
          ))}
      </ul>
      <div className="flex space-x-2 ms-auto w-fit">
        <button
          className="rounded-sm bg-primary text-white cursor-pointer px-3 disabled:opacity-50 disabled:pointer-events-none py-1 flex justify-between items-center"
          disabled={!changed}
          onClick={() => {
            let attrids = "";
            selectedAttributeValues.forEach(
              (item) => (attrids += item.id + ",")
            );
            setQuery({
              ...query,
              vids: selectedAttributeValues.map((item) => item.id),
              page: 1,
            });
            setChanged(false);
          }}
        >
          <i className="bx bxs-filter-alt me-2"></i>
          Lọc
        </button>
        <button
          className="border border-red-500 py-1 px-3 rounded-sm disabled:opacity-50 disabled:pointer-events-none text-red-500 flex items-center space-x-2 cursor-pointer"
          disabled={selectedAttributeValues.length === 0}
          onClick={() => resetAttributeValues()}
        >
          <Trash className="p-1" />
          <span>Xóa tất cả</span>
        </button>
      </div>
    </div>
  );
}
