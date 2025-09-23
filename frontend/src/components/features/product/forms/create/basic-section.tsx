import CustomInput from "@/components/common/custom-input";
import SearchCombobox from "@/components/common/search-combobox";
import ProductFormLabel from "@/components/features/product/forms/create/product-form-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import { FormProductSchema } from "@/libs/schemas/form.schema";
import { Blocks } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export default function BasicSection({
  categories,
}: {
  categories: z.infer<typeof CategoryBaseSchema>[];
}) {
  const { control, setValue } =
    useFormContext<z.infer<typeof FormProductSchema>>();
  return (
    <>
      <section className="p-3 bg-white rounded-lg shadow">
        <p className="font-semibold flex space-x-1 mb-3">
          <Blocks /> <span>Cơ bản</span>
        </p>
        <FormField
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem>
              <ProductFormLabel>Tên sản phẩm (*)</ProductFormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="text"
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />

        <FormField
          name="desc"
          control={control}
          render={({ field }) => (
            <FormItem>
              <ProductFormLabel>Mô tả</ProductFormLabel>
              <FormControl>
                <Textarea
                  className="w-full border rounded-md p-2"
                  {...field}
                  value={field.value || undefined}
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />

        <FormField
          name="datasheetLink"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem>
              <ProductFormLabel>Link datasheet</ProductFormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="text"
                  isError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-start item-start space-x-2">
          <FormField
            name="weight"
            control={control}
            render={({ field, fieldState }) => (
              <FormItem>
                <ProductFormLabel>Trọng lượng</ProductFormLabel>
                <FormControl>
                  <div className="flex space-x items-center space-x-2">
                    <CustomInput
                      type="number"
                      {...field}
                      placeholder="Khối lượng"
                      isError={fieldState.invalid}
                      min="0"
                      icon={<span className="px-4 border-l-2">gram</span>}
                      iconAlign="end"
                      onChange={(e) =>
                        setValue("weight", Number(e.currentTarget.value))
                      }
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="categoryId"
            control={control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <ProductFormLabel>Danh mục (*)</ProductFormLabel>
                <FormControl>
                  <SearchCombobox
                    searchPlaceholder="Chọn danh mục"
                    list={categories.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onItemSelect={(item) => field.onChange(Number(item.value))}
                    className={`bg-white p-5 rounded-md w-full ${
                      fieldState.error && "border-red-400 text-red-300"
                    }`}
                  ></SearchCombobox>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </section>
    </>
  );
}
