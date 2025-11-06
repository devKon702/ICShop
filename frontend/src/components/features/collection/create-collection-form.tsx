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
import { useModalActions } from "@/store/modal-store";
import { vietnameseRegex } from "@/utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
});

interface Props {
  onSuccess?: () => void;
}

export default function CreateCollectionForm({}: Props) {
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      desc: undefined,
    },
    mode: "onSubmit",
  });

  const { mutate: createCollectionMutate } = useMutation({
    mutationFn: (data: { name: string; desc?: string }) =>
      collectionService.admin.create({
        name: data.name,
        desc: data.desc,
        isActive: false,
      }),
    onSuccess: () => {
      toast.success("Tạo bộ sưu tập thành công.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(
        error.message || "Tạo bộ sưu tập thất bại. Vui lòng thử lại."
      );
    },
  });
  return (
    <Form {...form}>
      <form
        className="p-4 space-y-2 min-w-[40dvw]"
        onSubmit={form.handleSubmit((data: z.infer<typeof schema>) =>
          createCollectionMutate({ name: data.name, desc: data.desc })
        )}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold opacity-50">Tên</FormLabel>
              <CustomInput
                {...field}
                isError={!!form.formState.errors.name}
                type="text"
                autoComplete="off"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold opacity-50">Mô tả</FormLabel>
              <CustomInput
                {...field}
                isError={!!form.formState.errors.desc}
                type="text"
                autoComplete="off"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex ml-auto">
          Tạo bộ sưu tập
        </Button>
      </form>
    </Form>
  );
}
