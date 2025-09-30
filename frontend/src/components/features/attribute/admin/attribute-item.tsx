"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AttributeWithValuesSchema } from "@/libs/schemas/attribute.schema";
import attributeValueService from "@/libs/services/attribute-value.service";
import attributeService from "@/libs/services/attribute.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

interface AttributeItemProps {
  attribute: z.infer<typeof AttributeWithValuesSchema>;
}

export default function AttributeItem({ attribute }: AttributeItemProps) {
  const { openModal, closeModal } = useModalActions();
  const { mutate: deleteAttributeMutate } = useMutation({
    mutationFn: (id: number) => attributeService.delete(id),
    onSuccess: () => {
      toast.success("Xóa thuộc tính thành công");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: editAttributeMutate } = useMutation({
    mutationFn: (name: string) => attributeService.update(attribute.id, name),
    onSuccess: () => {
      toast.success("Cập nhật thuộc tính thành công");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: addValueMutate } = useMutation({
    mutationFn: (value: string) =>
      attributeValueService.create(attribute.id, value),
    onSuccess: () => {
      toast.success("Thêm giá trị thành công");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: deleteValueMutate } = useMutation({
    mutationFn: (id: number) => attributeValueService.delete(id),
    onSuccess: () => {
      toast.success("Xóa giá trị thành công");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: editValueMutate } = useMutation({
    mutationFn: (data: { id: number; value: string }) =>
      attributeValueService.update(data.id, data.value),
    onSuccess: () => {
      toast.success("Cập nhật giá trị thành công");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="pl-4 border-l-2" key={attribute.id}>
      <div className="flex items-center p-2 hover:bg-background rounded-lg">
        <div className="flex flex-1 flex-wrap justify-start items-start space-x-2 space-y-2">
          <span className="font-semibold mr-3">{attribute.name}:</span>
          {attribute.values.map((item) => (
            <Popover key={item.id}>
              <PopoverTrigger className="px-2 py-1 bg-primary-light rounded-lg mr-1 cursor-pointer flex space-x-4  items-center">
                {item.value}
              </PopoverTrigger>
              <PopoverContent className="w-fit space-y-2 p-2" side="right">
                <div
                  className="font-semibold flex items-center space-x-2 hover:bg-primary hover:text-white px-4 py-1 rounded-lg cursor-pointer"
                  onClick={() => {
                    openModal({
                      type: "prompt",
                      props: {
                        title: "Sửa giá trị",
                        defaultValue: item.value,
                        onSubmit: (value) => {
                          editValueMutate({ id: item.id, value });
                        },
                      },
                    });
                  }}
                >
                  <Pencil className="size-4" />
                  <span>Sửa</span>
                </div>
                <div
                  className="font-semibold flex items-center space-x-2 hover:bg-red-400 hover:text-white px-4  py-1 rounded-lg cursor-pointer"
                  onClick={() => {
                    if (
                      confirm(
                        `Bạn có chắc muốn xóa giá trị ${attribute.name}:${item.value} ?`
                      )
                    ) {
                      deleteValueMutate(item.id);
                      closeModal();
                    }
                  }}
                >
                  <Trash className="size-4" />
                  <span>Xóa</span>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <div className="space-x-2 flex flex-nowrap">
          <Button
            className="cursor-pointer"
            onClick={() => {
              openModal({
                type: "prompt",
                props: {
                  title: "Thêm giá trị",
                  placeholder: "Giá trị",
                  onSubmit: (value) => {
                    addValueMutate(value);
                  },
                },
              });
            }}
          >
            <Plus />
            Giá trị
          </Button>
          <Button
            className="cursor-pointer  "
            onClick={() => {
              openModal({
                type: "prompt",
                props: {
                  title: "Sửa thuộc tính",
                  defaultValue: attribute.name,
                  onSubmit: (name) => {
                    editAttributeMutate(name);
                  },
                },
              });
            }}
          >
            <Pencil />
          </Button>
          <Button
            className="bg-red-400 text-white hover:bg-red-500 cursor-pointer"
            onClick={() => {
              if (confirm("Xác nhận xóa thuộc tính " + attribute.name)) {
                deleteAttributeMutate(attribute.id);
              }
            }}
          >
            <Trash />
          </Button>
        </div>
      </div>
    </div>
  );
}
