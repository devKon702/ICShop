"use client";
import CustomInput from "@/components/common/custom-input";
import React from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  text: z
    .string()
    .max(100, "Tối đa 100 kí tự")
    .trim()
    .nonempty("Không được bỏ trống"),
});

interface Props {
  title: string;
  placeholder?: string;
  onSubmit: (text: string) => void | Promise<void>;
  defaultValue?: string;
}

export default function PromptForm({
  title,
  placeholder,
  onSubmit,
  defaultValue = "",
}: Props) {
  const form = useForm<{ text: string }>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: defaultValue,
    },
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        className="w-full min-w-lg flex flex-col space-y-4 p-4"
        onSubmit={form.handleSubmit((data) => onSubmit(data.text))}
      >
        <FormField
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  placeholder={placeholder}
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
          {title}
        </button>
      </form>
    </Form>
  );
}
