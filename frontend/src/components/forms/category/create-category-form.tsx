"use client";

import CustomInput from "@/components/common/custom-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CreateCategoryType } from "@/libs/schemas/category.schema";
import categoryService from "@/libs/services/category.service";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .max(100, "Tối đa 100 kí tự")
    .trim()
    .nonempty("Không được bỏ trống tên"),
});

interface Props {
  parentId?: number;
  onSuccess: (result: CreateCategoryType) => void;
}

export default function CreateCategoryForm({ parentId, onSuccess }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col space-y-4"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) => {
          categoryService
            .create(data.name, parentId)
            .then((res) => {
              onSuccess(res.data);
            })
            .catch((e) => toast.error(e.message));
        })}
      >
        {/* Name */}
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  placeholder="Tên danh mục"
                  isError={fieldState.invalid}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
        >
          Lưu danh mục
        </button>
      </form>
    </Form>
  );
}
