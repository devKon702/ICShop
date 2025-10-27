import SearchCombobox from "@/components/common/search-combobox";
import AttributeSelector from "@/components/features/product/admin/forms/shared/attribute-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import attributeService from "@/libs/services/attribute.service";
import categoryService from "@/libs/services/category.service";
import productService from "@/libs/services/product.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  categoryId: z.number().min(1, "Vui lòng chọn danh mục"),
  vids: z.array(z.number().min(1)),
});

interface Props {
  productId: number;
  category: { id: number; name: string };
  productValues: {
    id: number;
    value: string;
    attribute: { id: number; name: string };
  }[];
}

export default function UpdateCategoryForm({
  productId,
  category,
  productValues,
}: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: category.id,
      vids: productValues.map((item) => item.id),
    },
    mode: "onSubmit",
  });
  const categoryId = form.watch("categoryId");

  const [enable, setEnable] = React.useState(false);
  const [attributeRows, setAttributeRows] = React.useState<
    {
      id: string;
      attribute: {
        id: number;
        name: string;
        values: { id: number; value: string }[];
      } | null;
    }[]
  >(
    productValues.map((item) => ({
      id: nanoid(),
      attribute: {
        id: item.attribute.id,
        name: item.attribute.name,
        values: [{ id: item.id, value: item.value }],
      },
    }))
  );
  const [selectedPairs, setSelectedPairs] = React.useState<
    { attributeId: number; valueId: number }[]
  >(
    productValues.map((item) => ({
      attributeId: item.attribute.id,
      valueId: item.id,
    }))
  );

  const { data: categoryResponse } = useQuery({
    queryKey: ["categories", { level: 3 }],
    queryFn: async () => categoryService.getLeafCategory(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: attributeResponse } = useQuery({
    queryKey: ["attributes", { categoryId }],
    queryFn: async () =>
      attributeService.getByCategoryId(categoryId).then((res) => {
        setAttributeRows((prev) =>
          prev.map((row) => {
            // Update attribute values from fetched data
            const attr = res.data.find((item) => item.id === row.attribute?.id);
            if (attr) {
              return {
                ...row,
                attribute: {
                  id: attr.id,
                  name: attr.name,
                  values: attr.values.map((v) => ({
                    id: v.id,
                    value: v.value,
                  })),
                },
              };
            }
            return row;
          })
        );
        return res;
      }),
    enabled: Boolean(categoryId),
    staleTime: 5 * 60 * 1000,
  });
  const queryClient = useQueryClient();

  const { mutate: updatewMutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      productService.admin.updateCategory(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật thành công");
      setEnable(false);
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật danh mục thất bại");
    },
  });

  useEffect(() => {
    form.setValue(
      "vids",
      selectedPairs.map((pair) => pair.valueId)
    );
  }, [selectedPairs, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updatewMutate(data))}
        className="w-full space-y-4 bg-white p-4 rounded-lg shadow"
      >
        <p className="font-semibold flex space-x-1 mb-3">
          <Tag /> <span>Thông số</span>
        </p>
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <FormLabel className="opacity-50 mt-2">Danh mục (*)</FormLabel>
              <FormControl>
                <SearchCombobox
                  searchPlaceholder="Chọn danh mục"
                  list={
                    categoryResponse?.data.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || []
                  }
                  initialValue={field.value}
                  onItemSelect={(item) => {
                    form.setValue("categoryId", Number(item.value));
                    setAttributeRows([]);
                    setSelectedPairs([]);
                    setEnable(true);
                  }}
                  className={`bg-white p-5 rounded-md w-full ${
                    fieldState.error && "border-red-400 text-red-300"
                  }`}
                ></SearchCombobox>
              </FormControl>
            </FormItem>
          )}
        />
        <AttributeSelector
          attributes={
            attributeResponse?.data.map((item) => ({
              id: item.id,
              name: item.name,
              values: item.values.map((v) => ({ id: v.id, value: v.value })),
            })) || []
          }
          rows={attributeRows}
          selectedPairs={selectedPairs}
          onAttributeSelected={(attribute, rowId) => {
            setAttributeRows((prev) =>
              prev.map((row) =>
                row.id === rowId ? { ...row, attribute } : row
              )
            );
            // Remove previous selected pair when attribute changes
            const prevAttribute = attributeRows.find(
              (r) => r.id === rowId
            )?.attribute;
            setSelectedPairs((prev) =>
              prev.filter((pair) => pair.attributeId !== prevAttribute?.id)
            );
            setEnable(true);
          }}
          onValueSelected={(valueId, rowId) => {
            const rowIndex = attributeRows.findIndex((r) => r.id === rowId);
            if (rowIndex === -1) return;
            let tmpSelectedPairs = [];
            // Update or add the selected pair
            if (
              selectedPairs.some(
                (pair) =>
                  pair.attributeId === attributeRows[rowIndex].attribute?.id
              )
            ) {
              // Update existing pair
              tmpSelectedPairs = selectedPairs.map((pair) =>
                pair.attributeId === attributeRows[rowIndex].attribute?.id
                  ? { ...pair, valueId }
                  : pair
              );
            } else {
              // Add new pair
              tmpSelectedPairs = [...selectedPairs];
              tmpSelectedPairs.splice(
                attributeRows.indexOf(attributeRows[rowIndex]),
                0,
                {
                  attributeId: attributeRows[rowIndex].attribute!.id,
                  valueId,
                }
              );
            }
            setSelectedPairs([...tmpSelectedPairs]);
          }}
          onAddRow={() => {
            setAttributeRows((prev) => [
              ...prev,
              { id: nanoid(), attribute: null },
            ]);
          }}
          onRemoveRow={(rowId) => {
            const row = attributeRows.find((r) => r.id === rowId);
            setAttributeRows((prev) => prev.filter((row) => row.id !== rowId));
            setSelectedPairs((prev) =>
              prev.filter((pair) => pair.attributeId !== row?.attribute?.id)
            );
          }}
        />
        <Button disabled={!enable || isPending} className="block w-fit ml-auto">
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
