import Input from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import attributeValueService from "@/libs/services/attribute-value.service";
import { vietnameseRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  value: z
    .string()
    .trim()
    .nonempty()
    .regex(
      vietnameseRegex(true),
      "Giá trị chỉ bao gồm khoảng trắng, chữ cái và số"
    ),
});

interface Props {
  attributeId: number;
  onSuccess: () => void;
}

export default function CreateValueForm({ attributeId, onSuccess }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      value: "",
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col space-y-4"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) => {
          attributeValueService
            .create(attributeId, data.value)
            .then(() => onSuccess())
            .catch(() => toast.error("Thêm giá trị thất bại"));
        })}
      >
        {/* Name */}
        <FormField
          name="value"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Giá trị thông số"
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
          Lưu giá trị
        </button>
      </form>
    </Form>
  );
}
