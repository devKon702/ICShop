import CustomInput from "@/components/common/custom-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProductSchema } from "@/libs/schemas/form.schema";
import productService from "@/libs/services/product.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash, Wallet } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  wholesale: FormProductSchema.shape.wholesale,
});

interface Props {
  productId: number;
  wholesale: {
    min_quantity: number;
    max_quantity: number;
    unit: string;
    quantity_step: number;
    vat: number;
    details: {
      min: number;
      price: number;
      desc: string;
    }[];
  };
}

export default function UpdateWholesaleForm({ productId, wholesale }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wholesale: {
        min_quantity: wholesale.min_quantity,
        max_quantity: wholesale.max_quantity,
        unit: wholesale.unit,
        quantity_step: wholesale.quantity_step,
        vat: wholesale.vat,
        details: wholesale.details,
      },
    },
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();
  const { fields: details } = useFieldArray({
    control: form.control,
    name: "wholesale.details",
  });

  const [enable, setEnable] = React.useState(false);

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      productService.admin.updateWholesale(productId, {
        ...data.wholesale,
        details: data.wholesale.details.map((item) => ({ ...item, max: null })),
      }),
    onSuccess: () => {
      toast.success("Cập nhật bảng giá thành công");
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEnable(false);
    },
    onError: () => {
      toast.error("Cập nhật bảng giá thất bại, vui lòng thử lại");
      setEnable(true);
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateMutate(data))}
        className="w-full p-4 rounded-lg shadow bg-white space-y-4"
      >
        <p className="font-semibold flex space-x-1 mb-3">
          <Wallet /> <span>Bảng giá</span>
        </p>
        <div className="flex space-x-2">
          <FormField
            name="wholesale.min_quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel className="opacity-50 mt-2">Mua tối thiểu</FormLabel>
                <FormControl>
                  <CustomInput
                    type="number"
                    isError={fieldState.invalid}
                    {...field}
                    min="1"
                    onChange={(e) => {
                      form.setValue(
                        "wholesale.min_quantity",
                        Number(e.currentTarget.value)
                      );
                      setEnable(true);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="wholesale.max_quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel className="opacity-50 mt-2">Mua tối đa</FormLabel>
                <FormControl>
                  <CustomInput
                    type="number"
                    {...field}
                    isError={fieldState.invalid}
                    min="1"
                    max="999"
                    onChange={(e) => {
                      form.setValue(
                        "wholesale.max_quantity",
                        Number(e.currentTarget.value)
                      );
                      setEnable(true);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="wholesale.unit"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel className="opacity-50 mt-2">Đơn vị</FormLabel>
                <FormControl>
                  <CustomInput
                    type="text"
                    {...field}
                    isError={fieldState.invalid}
                    onChange={(e) => {
                      form.setValue("wholesale.unit", e.currentTarget.value);
                      setEnable(true);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="wholesale.quantity_step"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel className="opacity-50 mt-2">Bội số</FormLabel>
                <FormControl>
                  <CustomInput
                    type="number"
                    {...field}
                    isError={fieldState.invalid}
                    min="1"
                    onChange={(e) => {
                      form.setValue(
                        "wholesale.quantity_step",
                        Number(e.currentTarget.value)
                      );
                      setEnable(true);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="wholesale.vat"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel className="opacity-50 mt-2">VAT (%)</FormLabel>
                <FormControl>
                  <CustomInput
                    type="number"
                    inputMode="decimal"
                    step={0.01}
                    min="0"
                    {...field}
                    isError={fieldState.invalid}
                    onChange={(e) => {
                      form.setValue(
                        "wholesale.vat",
                        Number(e.currentTarget.value)
                      );
                      setEnable(true);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {details.map((fieldItem, index: number) => (
          <div key={fieldItem.id} className="flex space-x-2 items-start mb-2">
            <FormField
              control={form.control}
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
                        form.setValue(
                          `wholesale.details.${index}.min`,
                          Number(e.currentTarget.value)
                        );
                        form.setValue(
                          `wholesale.details.${index}.desc`,
                          `${e.currentTarget.value}+`
                        );
                        setEnable(true);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
                      icon={
                        <span className="px-4 border-l-2 shrink-0">VND</span>
                      }
                      iconAlign="end"
                      onChange={(e) => {
                        form.setValue(
                          `wholesale.details.${index}.price`,
                          Number(e.currentTarget.value)
                        );
                        setEnable(true);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
                  if (details.length > 1) {
                    form.setValue(
                      "wholesale.details",
                      form
                        .getValues("wholesale.details")
                        .filter((_, i) => i !== index)
                    );
                    setEnable(true);
                  }
                }}
              />
            </div>
          </div>
        ))}
        <p className="text-red-400">
          {form.formState.errors.wholesale?.message}
        </p>

        <div
          className="w-full p-2 flex space-x-2 bg-primary-light text-primary font-semibold round-sm cursor-pointer"
          onClick={() => {
            const last = details.findLast(() => true);
            const nextMin = last ? Number(last.min) + 1 : 1;
            form.setValue("wholesale.details", [
              ...form.getValues("wholesale.details"),
              { min: nextMin, desc: `${nextMin}+`, price: 0 },
            ]);
            setEnable(true);
          }}
        >
          <Plus /> <span>Giá</span>
        </div>
        <Button className="block mt-4 ml-auto" disabled={!enable || isPending}>
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
