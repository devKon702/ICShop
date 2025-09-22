import SearchCombobox from "@/components/common/search-combobox";
import { GetAttributeListWithValues } from "@/libs/schemas/attribute.schema";
import { FormProductSchema } from "@/libs/schemas/form.schema";
import { Plus, Tag, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AttributeSection({
  attributes,
}: {
  attributes: z.infer<typeof GetAttributeListWithValues>;
}) {
  const { getFieldState, setValue } =
    useFormContext<z.infer<typeof FormProductSchema>>();
  const [attributeError] = useState(getFieldState("valueIds").error);
  // Contain list of choosed attribute + unique id for rendering
  const [rowDatas, setRowDatas] = useState<
    { id: string; attribute: (typeof attributes)[number] | undefined }[]
  >([{ id: nanoid(), attribute: undefined }]);

  // Use for delete last valueId when change/delete
  const [selectedPairs, setSelectedPairs] = useState<
    { attributeId: number; valueId: number }[]
  >([]);

  useEffect(() => {
    setValue(
      "valueIds",
      selectedPairs.map((item) => item.valueId)
    );
  }, [selectedPairs, setValue]);

  useEffect(() => {
    if (attributeError) toast.error(attributeError.message);
  }, [attributeError]);

  return (
    <section className="p-3 bg-white rounded-lg shadow">
      <p className="font-semibold flex space-x-1 mb-3">
        <Tag /> <span>Thông số</span>
      </p>

      {rowDatas.map((row, index) => (
        <div key={row.id}>
          <div className="flex space-x-2 items-center mb-2">
            {/* Combobox for choosing attribute */}
            <SearchCombobox
              searchPlaceholder="Chọn loại"
              list={attributes
                .filter(
                  (attr) =>
                    attr.id === row.attribute?.id ||
                    !rowDatas.map((r) => r.attribute?.id || 0).includes(attr.id)
                )
                .map((attr) => ({
                  value: attr.id,
                  label: attr.name,
                }))}
              initialValue={row.attribute?.id}
              onItemSelect={(item) => {
                const lastAttribute = row.attribute;
                const selectedAttribute = attributes.find(
                  (attr) => attr.id === item.value
                );
                // Cập nhật lại attribute cho row này
                setRowDatas([
                  ...rowDatas.map((r) =>
                    r.id === row.id
                      ? { id: row.id, attribute: selectedAttribute }
                      : r
                  ),
                ]);
                // if this is attribute changing -> Remove the old selected pair attributeId - valueId
                if (lastAttribute) {
                  setSelectedPairs([
                    ...selectedPairs.filter(
                      (pair) => pair.attributeId !== lastAttribute.id
                    ),
                  ]);
                }
              }}
              className="bg-white p-5 rounded-md w-full flex-1"
            ></SearchCombobox>
            <SearchCombobox
              searchPlaceholder="Chọn giá trị"
              list={
                row.attribute?.values.map((item) => ({
                  value: item.id,
                  label: item.value,
                })) || []
              }
              onItemSelect={(item) => {
                if (
                  selectedPairs.some(
                    (pair) => pair.attributeId === row.attribute!.id
                  )
                ) {
                  setSelectedPairs([
                    ...selectedPairs.map((pair) =>
                      pair.attributeId === row.attribute!.id
                        ? {
                            attributeId: row.attribute!.id,
                            valueId: item.value,
                          }
                        : pair
                    ),
                  ]);
                } else {
                  selectedPairs.splice(index, 0, {
                    attributeId: row.attribute!.id,
                    valueId: item.value,
                  });
                  setSelectedPairs([...selectedPairs]);
                }
              }}
              className="bg-white p-5 rounded-md w-full flex-1"
            ></SearchCombobox>
            <div
              className="h-full bg-red-100 p-2 rounded-sm"
              onClick={() => {
                setRowDatas([...rowDatas.filter((r) => r.id !== row.id)]);
                setSelectedPairs([
                  ...selectedPairs.filter(
                    (pair) => pair.attributeId !== row.attribute?.id
                  ),
                ]);
              }}
            >
              <Trash className="text-red-400 cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </div>
      ))}
      <div
        className="w-full p-2 flex space-x-2 bg-primary-light text-primary font-semibold round-sm cursor-pointer"
        onClick={() => {
          if (rowDatas.some((row) => !row.attribute)) return;
          setRowDatas([...rowDatas, { id: nanoid(), attribute: undefined }]);
        }}
      >
        <Plus /> <span>Giá trị</span>
      </div>
      <p className="text-red-300">{getFieldState("valueIds").error?.message}</p>
    </section>
  );
}
