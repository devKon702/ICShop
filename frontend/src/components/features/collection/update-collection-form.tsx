import AppSelector from "@/components/common/app-selector";
import CustomInput from "@/components/common/custom-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import collectionService from "@/libs/services/collection.service";
import { vietnameseRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  collection: {
    id: number;
    name: string;
    desc?: string;
    isActive: boolean;
  };
}

const schema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Tên bộ sưu tập tối đa chỉ 100 ký tự")
    .nonempty("Tên bộ sưu tập không được để trống")
    .regex(vietnameseRegex(true), {
      message:
        "Tên bộ sưu tập chỉ bao gồm chữ cái tiếng Việt, số và khoảng trắng",
    }),
  desc: z.string().max(200, "Mô tả tối đa chỉ 200 ký tự").trim().optional(),
  isActive: z.boolean(),
});

export default function UpdateCollectionForm({ collection }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: collection.name,
      desc: collection.desc,
      isActive: collection.isActive,
    },
    mode: "onSubmit",
  });

  const queryClient = useQueryClient();

  const { mutate: updateCollectionMutate } = useMutation({
    mutationFn: (data: { name: string; desc?: string; isActive: boolean }) =>
      collectionService.admin.update(collection.id, {
        name: data.name,
        desc: data.desc,
        isActive: data.isActive,
      }),
    onSuccess: () => {
      toast.success("Cập nhật bộ sưu tập thành công.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "Cập nhật bộ sưu tập thất bại. Vui lòng thử lại."
      );
    },
  });

  const { mutate: deleteCollectionMutate } = useMutation({
    mutationFn: () => collectionService.admin.delete(collection.id),
    onSuccess: () => {
      toast.success("Xóa bộ sưu tập thành công.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "Xóa bộ sưu tập thất bại. Vui lòng thử lại."
      );
    },
  });

  return (
    <Form {...form}>
      <form
        className="p-4 space-y-2 min-w-[40dvw]"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) =>
          updateCollectionMutate({
            name: data.name,
            desc: data.desc,
            isActive: data.isActive,
          })
        )}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-5 w-full">
              <FormLabel className="font-semibold opacity-50 col-span-1">
                Tên
              </FormLabel>
              <div className="col-span-4">
                <CustomInput
                  {...field}
                  isError={!!form.formState.errors.name}
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div></div>
              <FormMessage className="col-span-4" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem className="grid grid-cols-5 w-full">
              <FormLabel className="font-semibold opacity-50 col-span-1">
                Mô tả
              </FormLabel>
              <div className="col-span-4">
                <CustomInput
                  {...field}
                  isError={!!form.formState.errors.desc}
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div></div>
              <FormMessage className="col-span-4" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="grid grid-cols-5 w-full items-center">
              <FormLabel className="font-semibold opacity-50 col-span-1">
                Trạng thái
              </FormLabel>
              <div className="col-span-4">
                <AppSelector
                  data={
                    [
                      { label: "Kích hoạt", value: "true" },
                      { label: "Ẩn", value: "false" },
                    ] as const
                  }
                  defaultValue={String(field.value) as "true" | "false"}
                  onValueChange={(val) => field.onChange(JSON.parse(val))}
                  className="w-full"
                />
              </div>
            </FormItem>
          )}
        />
        <div className="flex space-x-2 items-center justify-end">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Cập nhật
          </Button>
          <Button
            type="button"
            className="hover:bg-red-500/10 text-red-500 bg-transparent"
            onClick={() => {
              if (confirm("Xác nhận xóa bộ sưu tập " + collection.name)) {
                deleteCollectionMutate();
              }
            }}
          >
            <Trash />
          </Button>
        </div>
      </form>
    </Form>
  );
}
