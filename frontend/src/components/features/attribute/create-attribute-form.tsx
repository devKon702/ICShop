import CustomInput from "@/components/common/custom-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CreateAttributeSchema } from "@/libs/schemas/attribute.schema";
import attributeService from "@/libs/services/attribute.service";
import { vietnameseRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Không được bỏ trống tên")
    .regex(vietnameseRegex(false), "Tên chỉ bao gồm khoảng trắng và chữ cái"),
});

interface Props {
  categoryId: number;
  onSuccess: (result: z.infer<typeof CreateAttributeSchema>) => void;
}

export default function CreateAttributeForm({ categoryId, onSuccess }: Props) {
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
        className="w-full min-w-lg flex flex-col space-y-4 p-4"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) => {
          attributeService
            .create(categoryId, data.name)
            .then((res) => onSuccess(res.data))
            .catch(() => toast.error("Thêm thông số thất bại"));
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
                  placeholder="Tên thuộc tính"
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
          Lưu thông số
        </button>
      </form>
    </Form>
  );
}
