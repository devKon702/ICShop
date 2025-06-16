"use client";
import AttributeValuePopup from "@/components/features/filter/attribute-value-popup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterContext } from "@/libs/contexts/FilterContext";

import { Attribute } from "@/libs/models/attribute";
import { getIdFromString } from "@/utils/string";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface SideAttributeFilterProps {
  attributes: Attribute[];
}

export default function SideAttributeFilter({
  attributes,
}: SideAttributeFilterProps) {
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
      </div>
    </div>
  );
}

interface AttributeItemProps {
  attribute: Attribute;
}

function AttributeItem({ attribute }: AttributeItemProps) {
  const [highlight, setHighlight] = React.useState(false);
  const { toggleAttributeValues } = useFilterContext();
  const searchParams = useSearchParams();
  useEffect(() => {
    const attrids = new URLSearchParams(searchParams.toString()).get("attrids");
    const ids = getIdFromString(attrids);
    attribute.values?.forEach((item) => {
      if (ids.some((id) => id == Number(item.id))) {
        toggleAttributeValues(item);
      }
    });
  }, []);
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
          values={attribute.values || []}
        ></AttributeValuePopup>
      </PopoverContent>
    </Popover>
  );
}
