import AppTextEditor from "@/components/common/app-text-editor";
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
import productService from "@/libs/services/product.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Blocks } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().nonempty(),
  desc: z.string().trim().nullable(),
  datasheetLink: z.string().nullable(),
  weight: z
    .number()
    .int("Phải là kiểu số nguyên")
    .min(0, "Cân nặng tối thiểu 0 gram"),
});

interface Props {
  productId: number;
  name: string;
  desc: string | null;
  datasheetLink: string | null;
  weight: number;
}

export default function UpdateBasicForm({
  productId,
  name,
  desc,
  datasheetLink,
  weight,
}: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
      desc: desc,
      datasheetLink: datasheetLink,
      weight: weight,
    },
    mode: "onSubmit",
  });

  const [enable, setEnable] = React.useState(false);

  const queryClient = useQueryClient();
  const { mutate: updateBasicMutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) =>
      productService.admin.updateBasic(productId, {
        name: data.name,
        desc: data.desc,
        datasheetLink: data.datasheetLink,
        weight: data.weight,
      }),

    onSuccess: () => {
      toast.success("Cập nhật thông tin cơ bản sản phẩm thành công");
      setEnable(false);
      queryClient.invalidateQueries({
        queryKey: ["product", { id: productId }],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "Cập nhật thông tin cơ bản sản phẩm thất bại"
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateBasicMutate(data))}
        className="space-y-4 bg-white p-4 rounded-lg shadow w-fit"
      >
        <p className="font-semibold flex space-x-1 mb-3">
          <Blocks /> <span>Cơ bản</span>
        </p>
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="opacity-50 mt-2">
                Tên sản phẩm (*)
              </FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  isError={fieldState.invalid}
                  type="text"
                  onChange={(e) => {
                    field.onChange(e);
                    setEnable(true);
                  }}
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />

        <FormField
          name="desc"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="opacity-50 mt-2">Mô tả</FormLabel>
              <FormControl>
                <AppTextEditor
                  defaultValue={desc || undefined}
                  onChange={(val) => {
                    field.onChange(val);
                    setEnable(true);
                  }}
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />

        <FormField
          name="datasheetLink"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="opacity-50 mt-2">Link datasheet</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="text"
                  isError={fieldState.invalid}
                  value={field.value || undefined}
                  onChange={(e) => {
                    field.onChange(e);
                    setEnable(true);
                  }}
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />
        <FormField
          name="weight"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="opacity-50 mt-2">Trọng lượng</FormLabel>
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
                    onChange={(e) => {
                      form.setValue("weight", Number(e.currentTarget.value));
                      setEnable(true);
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="block w-fit ml-auto" disabled={!enable || isPending}>
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
