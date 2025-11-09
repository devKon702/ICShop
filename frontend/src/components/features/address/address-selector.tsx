import ClampText from "@/components/common/clamp-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/className";
import React from "react";

interface Props {
  data: {
    id: number;
    alias: string;
    detail: string;
    wardName: string;
    districtName: string;
    provinceName: string;
    receiverName: string;
    receiverPhone: string;
  }[];
  onSelect: (addressId: number) => void;
  defaultValue?: number;
  className?: string;
}

export default function AddressSelector({
  data,
  onSelect,
  defaultValue,
  className,
}: Props) {
  return (
    <Select
      onValueChange={(val) => onSelect(Number(val))}
      defaultValue={defaultValue?.toString()}
    >
      <SelectTrigger
        className={cn("w-full h-fit py-6 cursor-pointer", className)}
      >
        <SelectValue placeholder="Chọn địa chỉ nhận hàng" />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem
            key={item.id}
            value={item.id.toString()}
            className="cursor-pointer hover:bg-background"
          >
            <div className="flex flex-col items-start">
              <div className="flex justify-between w-full mb-1">
                <p className="font-medium">{item.alias}</p>
                <p className="text-sm opacity-50">{`${item.receiverName} - ${item.receiverPhone}`}</p>
              </div>
              <ClampText
                lines={1}
                text={`${item.detail}, ${item.wardName}, ${item.districtName}, ${item.provinceName}`}
                showTitle
              />
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
