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
import React, { useEffect } from "react";

interface SideAttributeFilterProps {
  data: {
    id: number;
    name: string;
    values: { id: number; value: string }[];
  }[];
}

export default function SideAttributeFilter({
  data,
}: SideAttributeFilterProps) {
  return (
    <div className="rounded-sm overflow-hidden shadow-xl bg-white">
      <div className="bg-primary text-white p-2 flex justify-start items-center space-x-2 font-bold">
        <i className="bx bxs-filter-alt"></i>
        <span>Lọc sản phẩm</span>
      </div>
      <div>
        {data.map((item) => (
          <AttributeItem key={item.id} attribute={item}></AttributeItem>
        ))}
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
          attributeId: attribute.id,
        });
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
          values={
            attribute.values.map((item) => ({
              ...item,
              attributeId: attribute.id,
            })) || []
          }
        ></AttributeValuePopup>
      </PopoverContent>
    </Popover>
  );
}
