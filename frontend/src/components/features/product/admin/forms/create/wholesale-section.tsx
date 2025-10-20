import CustomInput from "@/components/common/custom-input";
import Separator from "@/components/common/separator";
import ProductFormLabel from "@/components/features/product/admin/forms/create/product-form-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormProductSchema } from "@/libs/schemas/form.schema";
import { Plus, Trash, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function WholesaleSection({
  fields,
  onAdd,
  onRemove,
}: {
  fields: (z.infer<
    typeof FormProductSchema.shape.wholesale
  >["details"][number] & {
    id: string;
  })[];
  onAdd: (data: {
    min: number;
    max: null;
    desc: string;
    price: number;
  }) => void;
  onRemove: (index: number) => void;
}) {
  const { control, setValue, getValues, getFieldState } =
    useFormContext<z.infer<typeof FormProductSchema>>();
  const [wholesaleError] = useState(getFieldState("wholesale").error);
  useEffect(() => {
    if (wholesaleError) toast.error(wholesaleError.message);
  }, [wholesaleError]);
  return (
    <section className="p-3 bg-white rounded-lg shadow">
      <p className="font-semibold flex space-x-1 mb-3">
        <Wallet /> <span>Bảng giá</span>
      </p>
      <div className="flex space-x-2">
        <FormField
          name="wholesale.min_quantity"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <ProductFormLabel>Mua tối thiểu</ProductFormLabel>
              <FormControl>
                <CustomInput
                  type="number"
                  isError={fieldState.invalid}
                  {...field}
                  min="1"
                  onChange={(e) =>
                    setValue(
                      "wholesale.min_quantity",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="wholesale.max_quantity"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <ProductFormLabel>Mua tối đa</ProductFormLabel>
              <FormControl>
                <CustomInput
                  type="number"
                  {...field}
                  isError={fieldState.invalid}
                  min="1"
                  max="999"
                  onChange={(e) =>
                    setValue(
                      "wholesale.max_quantity",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="wholesale.unit"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <ProductFormLabel>Đơn vị</ProductFormLabel>
              <FormControl>
                <CustomInput
                  type="text"
                  {...field}
                  isError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="wholesale.quantity_step"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <ProductFormLabel>Bội số</ProductFormLabel>
              <FormControl>
                <CustomInput
                  type="number"
                  {...field}
                  isError={fieldState.invalid}
                  min="1"
                  onChange={(e) =>
                    setValue(
                      "wholesale.quantity_step",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="wholesale.vat"
          control={control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <ProductFormLabel>VAT (%)</ProductFormLabel>
              <FormControl>
                <CustomInput
                  type="number"
                  inputMode="decimal"
                  step={0.01}
                  min="0"
                  {...field}
                  isError={fieldState.invalid}
                  onChange={(e) => {
                    setValue("wholesale.vat", Number(e.currentTarget.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Details array */}
      <Separator className="my-4" />
      <div className="flex pr-10 mb-2">
        <p className="flex-1 font-semibold opacity-50 text-sm ">Từ</p>
        <p className="flex-1 font-semibold opacity-50 text-sm ">Giá</p>
        <p className="flex-1 font-semibold opacity-50 text-sm ">Mô tả</p>
      </div>
      {fields.map((fieldItem, index: number) => (
        <div key={fieldItem.id} className="flex space-x-2 items-start mb-2">
          <FormField
            control={control}
            name={`wholesale.details.${index}.min`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <CustomInput
                    type="number"
                    isError={false}
                    placeholder="Min"
                    min="1"
                    {...field}
                    onChange={(e) => {
                      setValue(
                        `wholesale.details.${index}.min`,
                        Number(e.currentTarget.value)
                      );
                      setValue(
                        `wholesale.details.${index}.desc`,
                        `${e.currentTarget.value}+`
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`wholesale.details.${index}.price`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <CustomInput
                    type="number"
                    isError={false}
                    placeholder="Giá"
                    min="0"
                    {...field}
                    icon={<span className="px-4 border-l-2 shrink-0">VND</span>}
                    iconAlign="end"
                    onChange={(e) => {
                      setValue(
                        `wholesale.details.${index}.price`,
                        Number(e.currentTarget.value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`wholesale.details.${index}.desc`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <CustomInput
                    type="text"
                    isError={false}
                    placeholder="Mô tả"
                    {...field}
                    disable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="h-full bg-red-100 p-2 rounded-sm">
            <Trash
              className="text-red-400 cursor-pointer hover:text-red-500"
              onClick={() => {
                if (fields.length > 1) onRemove(index);
              }}
            />
          </div>
        </div>
      ))}

      <div
        className="w-full p-2 flex space-x-2 bg-primary-light text-primary font-semibold round-sm cursor-pointer"
        onClick={() => {
          const last = getValues("wholesale.details").findLast(() => true);
          const nextMin = last ? Number(last.min) + 1 : 1;
          onAdd({ min: nextMin, desc: `${nextMin}+`, price: 0, max: null });
        }}
      >
        <Plus /> <span>Giá</span>
      </div>
    </section>
  );
}
