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

interface Props {
  submitText?: string;
  placeholder?: string;
  onSubmit: (text: string) => void | Promise<void>;
  defaultValue?: string;
  maxLength?: number;
}

export default function PromptForm({
  submitText = "Xác nhận",
  placeholder,
  onSubmit,
  defaultValue = "",
  maxLength = 100,
}: Props) {
  const form = useForm<{ text: string }>({
    resolver: zodResolver(
      z.object({
        text: z
          .string()
          .max(maxLength, `Tối đa ${maxLength} ký tự`)
          .trim()
          .nonempty("Không được bỏ trống"),
      })
    ),
    defaultValues: {
      text: defaultValue,
    },
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        className="w-full min-w-lg flex flex-col p-4"
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
                  maxLength={maxLength}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="font-semibold opacity-50 text-sm px-2 ml-auto">{`Tối đa ${maxLength} kí tự`}</p>

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white cursor-pointer rounded-md  mt-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {submitText}
        </button>
      </form>
    </Form>
  );
}
