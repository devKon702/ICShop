import SearchCombobox from "@/components/common/search-combobox";
import { Plus, Trash } from "lucide-react";
import React from "react";

interface Props {
  attributes: {
    id: number;
    name: string;
    values: { id: number; value: string }[];
  }[];
  rows: { id: string; attribute: Props["attributes"][number] | null }[];
  selectedPairs: { attributeId: number; valueId: number }[];
  onAttributeSelected?: (
    attribute: Props["attributes"][number] | null,
    rowId: string
  ) => void;
  onValueSelected?: (valueId: number, rowId: string) => void;
  onAddRow?: () => void;
  onRemoveRow?: (rowId: string) => void;
}

export default function AttributeSelector({
  attributes,
  rows,
  selectedPairs,
  onAttributeSelected,
  onValueSelected,
  onAddRow,
  onRemoveRow,
}: Props) {
  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          <div className="flex space-x-2 items-center mb-2">
            {/* Combobox for choosing attribute */}
            <SearchCombobox
              searchPlaceholder="Chọn loại"
              // Filter out already selected attributes except the current row's attribute
              list={attributes
                .filter(
                  (attr) =>
                    attr.id === row.attribute?.id ||
                    !rows.some((r) => r.attribute?.id === attr.id)
                )
                .map((attr) => ({
                  value: attr.id,
                  label: attr.name,
                }))}
              initialValue={row.attribute?.id}
              onItemSelect={(item) => {
                onAttributeSelected?.(
                  attributes.find((attr) => attr.id === Number(item.value)) ||
                    null,
                  row.id
                );
              }}
              className="bg-white p-5 rounded-md w-full flex-1"
            />
            {/* Combobox for choosing attribute value */}
            <SearchCombobox
              searchPlaceholder="Chọn giá trị"
              list={
                row.attribute?.values.map((item) => ({
                  value: item.id,
                  label: item.value,
                })) || []
              }
              onItemSelect={(item) => {
                // let tmpSelectedPairs = [];
                // // Update or add the selected pair
                // if (
                //   selectedPairs.some(
                //     (pair) => pair.attributeId === row.attribute?.id
                //   )
                // ) {
                //   // Update existing pair
                //   console.log("updating pair");
                //   tmpSelectedPairs = selectedPairs.map((pair) =>
                //     pair.attributeId === row.attribute?.id
                //       ? {
                //           attributeId: row.attribute?.id,
                //           valueId: item.value,
                //         }
                //       : pair
                //   );
                // } else {
                //   console.log("adding pair");
                //   // Add new pair in the same position of the row
                //   selectedPairs.splice(index, 0, {
                //     attributeId: row.attribute!.id,
                //     valueId: item.value,
                //   });
                //   tmpSelectedPairs = [...selectedPairs];
                // }
                // setSelectedPairs([...tmpSelectedPairs]);
                // onSelectedPairsChange?.([...tmpSelectedPairs]);
                onValueSelected?.(Number(item.value), row.id);
              }}
              initialValue={
                selectedPairs.find(
                  (pair) => pair.attributeId === row.attribute?.id
                )?.valueId || undefined
              }
              className="bg-white p-5 rounded-md w-full flex-1"
            />
            <div
              className="h-full bg-red-100 p-2 rounded-sm"
              onClick={() => onRemoveRow?.(row.id)}
            >
              <Trash className="text-red-400 cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </div>
      ))}
      <div
        className="w-full p-2 flex space-x-2 bg-primary-light text-primary font-semibold round-sm cursor-pointer"
        onClick={() => onAddRow?.()}
      >
        <Plus /> <span>Giá trị</span>
      </div>
    </div>
  );
}
