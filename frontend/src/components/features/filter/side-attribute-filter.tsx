"use client";
import AttributeValuePopup from "@/components/features/filter/attribute-value-popup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAttributeFilterContext } from "@/libs/contexts/AttributeFilterContext";

import { getIdFromString } from "@/utils/string";
import { useSearchParams } from "next/navigation";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";
import React, { useEffect } from "react";

interface SideAttributeFilterProps {
  attributes: {
    id: number;
    name: string;
    values: { id: number; value: string }[];
  }[];
}

export default function SideAttributeFilter({
  attributes,
}: SideAttributeFilterProps) {
  const [vids] = useQueryState(
    "vids",
    parseAsArrayOf(parseAsInteger).withDefault([])
  );
  const { setSelectedAttributeValues } = useAttributeFilterContext();
  useEffect(() => {
    // Get initial selected attribute values from query
    const selectedValues: {
      id: number;
      value: string;
      attribute: { id: number; name: string };
    }[] = [];
    attributes.forEach((attr) => {
      attr.values?.forEach((item) => {
        if (vids.some((id) => id == Number(item.id))) {
          selectedValues.push({
            id: item.id,
            value: item.value,
            attribute: { id: attr.id, name: attr.name },
          });
        }
      });
    });
    setSelectedAttributeValues(selectedValues);
  }, [vids, attributes, setSelectedAttributeValues]);
  return (
    <div className="rounded-sm overflow-hidden shadow-xl bg-white">
      <div className="bg-primary text-white p-2 flex justify-start items-center space-x-2 font-bold">
        <i className="bx bxs-filter-alt"></i>
        <span>Lọc sản phẩm</span>
      </div>
      <div>
        {attributes.map((item) => (
          <AttributeItem key={item.id} attribute={item}></AttributeItem>
        ))}
        {attributes.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Không có thuộc tính để lọc
          </div>
        )}
      </div>
    </div>
  );
}

interface AttributeItemProps {
  attribute: {
    id: number;
    name: string;
    values: { id: number; value: string }[];
  };
}

function AttributeItem({ attribute }: AttributeItemProps) {
  const [highlight, setHighlight] = React.useState(false);
  const { toggleAttributeValues } = useAttributeFilterContext();
  const searchParams = useSearchParams();
  useEffect(() => {
    const attrids = new URLSearchParams(searchParams.toString()).get("attrids");
    const ids = getIdFromString(attrids);
    attribute.values?.forEach((item) => {
      if (ids.some((id) => id == Number(item.id))) {
        toggleAttributeValues({
          id: item.id,
          value: item.value,
          attribute: { id: attribute.id, name: attribute.name },
        });
      }
    });
  }, [searchParams, attribute, toggleAttributeValues]);
  return (
    <Popover onOpenChange={(open) => setHighlight(open)}>
      <PopoverTrigger
        className={`w-full p-2 hover:bg-primary-light cursor-pointer ${
          highlight ? "bg-primary-light" : ""
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <span>{attribute.name}</span>
          <i className="bx bx-chevron-right"></i>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="shadow-2xl border-2"
      >
        <AttributeValuePopup
          values={
            attribute.values.map((item) => ({
              ...item,
              attribute: { id: attribute.id, name: attribute.name },
            })) || []
          }
        ></AttributeValuePopup>
      </PopoverContent>
    </Popover>
  );
}
