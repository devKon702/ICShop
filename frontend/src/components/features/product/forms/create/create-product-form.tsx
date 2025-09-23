"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import { Button } from "@/components/ui/button";
import Separator from "@/components/common/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import attributeService from "@/libs/services/attribute.service";
import productService from "@/libs/services/product.service";
import { toast } from "sonner";
import { FormProductSchema } from "@/libs/schemas/form.schema";
import BasicSection from "@/components/features/product/forms/create/basic-section";
import AttributeSection from "@/components/features/product/forms/create/attribute-section";
import { WholesaleSection } from "@/components/features/product/forms/create/wholesale-section";
import ImageSection from "@/components/features/product/forms/create/image-section";

const FormSchema = FormProductSchema;
type FormValues = z.infer<typeof FormProductSchema>;

export default function CreateProductForm({
  categories,
  onSuccess,
}: {
  onSuccess: () => void;
  categories: z.infer<typeof CategoryBaseSchema>[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      weight: 0,
      wholesale: {
        min_quantity: 1,
        max_quantity: 999,
        unit: "cái",
        quantity_step: 1,
        vat: 0,
        details: [{ min: 1, max: null, price: 0, desc: "1+" }],
      },
      valueIds: [],
    },
    mode: "onBlur",
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const categoryIdWatch = form.watch("categoryId");

  const {
    fields: details,
    append: detailsAppend,
    remove: detailsRemove,
  } = useFieldArray({
    control: form.control,
    name: "wholesale.details",
  });

  const queryClient = useQueryClient();

  const { data: attributes, isLoading: isAttributeLoading } = useQuery({
    queryKey: ["attribute", { categoryId: categoryIdWatch }],
    queryFn: () => attributeService.getByCategoryId(categoryIdWatch),
    enabled: !!categoryIdWatch,
  });

  const { mutate: createProductMutate } = useMutation({
    mutationFn: async (data: FormValues) => {
      const {
        name,
        categoryId,
        weight,
        desc,
        wholesale,
        valueIds,
        datasheetLink,
      } = data;
      const newProductResponse = await productService.create({
        name,
        desc: desc || null,
        weight,
        categoryId,
        wholesale: {
          ...wholesale,
          details: wholesale.details.map((item) => ({
            ...item,
            max: item.max || null,
          })),
        },
        valueIds,
        datasheetLink: datasheetLink || null,
      });
      if (poster) {
        await Promise.all([
          productService.updatePoster(newProductResponse.data.id, poster),
          ...gallery.map((item) =>
            productService.addImageGallery(newProductResponse.data.id, item)
          ),
        ]);
      }
      return newProductResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Thêm thành công");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          if (!poster) {
            toast.error("Hãy thêm ảnh poster cho sản phẩm");
            return;
          }
          if (confirm("Xác nhận tạo sản phẩm")) {
            createProductMutate(data);
          }
        })}
      >
        <div className="space-y-2 max-h-96 overflow-y-scroll app px-4 mt-2">
          {/* Basics */}
          <BasicSection categories={categories}></BasicSection>
          {/* Attributes */}
          <AttributeSection
            attributes={
              isAttributeLoading || !attributes?.data ? [] : attributes.data
            }
          ></AttributeSection>

          {/* Wholesale */}
          <WholesaleSection
            fields={details}
            onAdd={detailsAppend}
            onRemove={detailsRemove}
          ></WholesaleSection>
          {/* Ảnh */}
          <ImageSection
            onPosterChange={(file) => setPoster(file)}
            onGalleryChange={(files) => setGallery(files)}
          ></ImageSection>
        </div>
        <Separator />
        <Button
          type="submit"
          className="flex ml-auto mr-4 my-4 px-4 py-2 text-white rounded-md font-semibold cursor-pointer opacity-80 hover:opacity-100"
          onClick={() => console.log(form.formState.errors)}
        >
          Tạo sản phẩm
        </Button>
      </form>
    </Form>
  );
}
