"use client";

import Input from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBaseSchema } from "@/libs/schemas/category.schema";
import SearchCombobox from "@/components/common/search-combobox";
import { Button } from "@/components/ui/button";
import {
  Blocks,
  ImagePlus,
  Images,
  Plus,
  Tag,
  Trash,
  Upload,
  Wallet,
} from "lucide-react";
import Separator from "@/components/common/separator";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import attributeService from "@/libs/services/attribute.service";
import { GetAttributeListWithValues } from "@/libs/schemas/attribute.schema";
import { useModalActions } from "@/store/modal-store";
import productService from "@/libs/services/product.service";

// === Schema bạn đã định nghĩa ===
const wholesaleSchema = z
  .object({
    min_quantity: z.coerce
      .number({ message: "Không bỏ trống" })
      .int("Phải là kiểu số nguyên")
      .min(1, "Tối thiếu 1"),
    max_quantity: z.coerce.number().int("Phải là kiểu số nguyên"),
    unit: z.coerce
      .string({ message: "Không bỏ trống" })
      .nonempty("Không bỏ trống"),
    quantity_step: z.coerce
      .number()
      .int("Phải là kiểu số nguyên")
      .min(1, "Bội số tối thiểu là 1"),
    vat: z.coerce.number().min(0, "Giá thuế tối thiểu là 0%"),
    details: z
      .array(
        z
          .object({
            min: z.coerce
              .number()
              .int("Phải là kiểu số nguyên")
              .min(1, "Tối thiểu là 0"),
            max: z.coerce.number().int("Phải là kiểu số nguyên").optional(),
            price: z.coerce.number().min(0, "Giá tối thiểu là 0"),
            desc: z.string().nonempty(),
          })
          .refine(
            (val) => val.max == null || val.min <= val.max,
            "Khoảng giá không hợp lệ"
          )
      )
      .min(1, "Tối thiểu có một giá bán"),
  })
  .refine(
    (data) => data.max_quantity >= data.min_quantity,
    "Phạm vi số lượng mua không hợp lệ"
  );

const createProductSchema = z.object({
  name: z.string({ message: "Không bỏ trống" }).nonempty("Không bỏ trống"),
  categoryId: z.coerce.number({ message: "Chọn một danh mục" }),
  desc: z.string().optional(),
  datasheetLink: z.string().max(250, "Tối đa 250 kí tự").optional(),
  weight: z.coerce
    .number({ message: "Không bỏ trống" })
    .int("Phải là kiểu số nguyên")
    .min(0, "Cân nặng tối thiểu 0 gram")
    .max(1000 * 1000, "Cân nặng tối đa 1 tấn"),
  wholesale: wholesaleSchema,
  valueIds: z.array(
    z.coerce.number().int("ID là kiểu số nguyên").min(1, "ID không hợp lệ")
  ),
});

type FormValues = z.infer<typeof createProductSchema>;

export default function CreateProductForm({
  categories,
}: {
  onSuccess: () => void;
  categories: z.infer<typeof CategoryBaseSchema>[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      // name: "",
      // categoryId: 0,
      // desc: "",
      // datasheetLink: "",
      weight: 0,
      wholesale: {
        min_quantity: 1,
        max_quantity: 999,
        unit: "cái",
        quantity_step: 1,
        vat: 0,
        details: [{ min: 1, max: undefined, price: 0, desc: "1+" }],
      },
      valueIds: [],
    },
    mode: "onSubmit",
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

  const { data: attributes, isLoading: isAttributeLoading } = useQuery({
    queryKey: ["attribute", { categoryId: categoryIdWatch }],
    queryFn: () => attributeService.getByCategoryId(categoryIdWatch),
    enabled: !!categoryIdWatch,
  });

  const { mutate: createProductMutate } = useMutation({
    mutationFn: (data: FormValues) => {
      const {
        name,
        categoryId,
        weight,
        desc,
        wholesale,
        valueIds,
        datasheetLink,
      } = data;
      return productService.create({
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
    },
    onSuccess: (response) => {
      console.log(response);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (confirm("Xác nhận tạo sản phẩm")) {
            createProductMutate(data);
          }
        })}
      >
        <div className="space-y-2 max-h-96 overflow-y-scroll app px-4 mt-2">
          {/* Basics */}
          <BasicSection form={form} categories={categories}></BasicSection>
          {/* Attributes */}
          <AttributeSection
            form={form}
            attributes={
              isAttributeLoading || !attributes?.data ? [] : attributes.data
            }
          ></AttributeSection>

          {/* Wholesale */}
          <WholesaleSection
            fields={details}
            form={form}
            onAdd={detailsAppend}
            onRemove={detailsRemove}
          ></WholesaleSection>
          {form.formState.errors.wholesale && (
            <p className="text-red-400">
              {form.formState.errors.wholesale.message}
            </p>
          )}
          {/* Ảnh */}
          <MediaSection
            onPosterChange={(file) => setPoster(file)}
            onGalleryChange={(files) => setGallery(files)}
          ></MediaSection>
        </div>
        <Separator />
        <Button
          type="submit"
          className="flex ml-auto mr-4 my-4 px-4 py-2 text-white rounded-md font-semibold cursor-pointer opacity-80 hover:opacity-100"
        >
          Tạo sản phẩm
        </Button>
      </form>
    </Form>
  );
}

export function LocalFormLabel({ children }: { children: string }) {
  return <FormLabel className="opacity-50  mt-2">{children}</FormLabel>;
}

export function BasicSection({
  form,
  categories,
}: {
  form: UseFormReturn<FormValues>;
  categories: z.infer<typeof CategoryBaseSchema>[];
}) {
  return (
    <>
      <section className="p-3 bg-white rounded-lg">
        <p className="font-semibold flex space-x-1 mb-3">
          <Blocks /> <span>Cơ bản</span>
        </p>
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <LocalFormLabel>Tên sản phẩm</LocalFormLabel>
              <FormControl>
                <Input {...field} isError={fieldState.invalid} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="desc"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <LocalFormLabel>Mô tả</LocalFormLabel>
              <FormControl>
                <Textarea
                  className="w-full border rounded-md p-2"
                  {...field}
                  value={field.value || undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="datasheetLink"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <LocalFormLabel>Link datasheet</LocalFormLabel>
              <FormControl>
                <Input {...field} type="text" isError={fieldState.invalid} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-start item-start space-x-2">
          <FormField
            name="weight"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <LocalFormLabel>Trọng lượng</LocalFormLabel>
                <FormControl>
                  <div className="flex space-x items-center space-x-2">
                    <Input
                      type="number"
                      {...field}
                      placeholder="Khối lượng"
                      isError={fieldState.invalid}
                      min="0"
                      icon={<span className="px-4 border-l-2">gram</span>}
                      iconAlign="end"
                      onChange={(e) =>
                        form.setValue("weight", Number(e.currentTarget.value))
                      }
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="categoryId"
            control={form.control}
            render={({ fieldState }) => (
              <FormItem className="flex-1">
                <LocalFormLabel>Danh mục</LocalFormLabel>
                <FormControl>
                  <SearchCombobox
                    searchPlaceholder="Chọn danh mục"
                    list={categories.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onItemSelect={(item) =>
                      form.setValue("categoryId", item.value as number)
                    }
                    className={`bg-white p-5 rounded-md w-full ${
                      fieldState.error && "border-red-400 text-red-300"
                    }`}
                  ></SearchCombobox>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </section>
    </>
  );
}

export function AttributeSection({
  form,
  attributes,
}: {
  form: UseFormReturn<FormValues>;
  attributes: z.infer<typeof GetAttributeListWithValues>;
}) {
  // Contain list of choosed attribute + unique id for rendering
  const [rowDatas, setRowDatas] = useState<
    { id: string; attribute: (typeof attributes)[number] | undefined }[]
  >([{ id: nanoid(), attribute: undefined }]);

  // Use for delete last valueId when change/delete
  const [selectedPairs, setSelectedPairs] = useState<
    { attributeId: number; valueId: number }[]
  >([]);

  useEffect(() => {
    console.log(selectedPairs);
    form.setValue(
      "valueIds",
      selectedPairs.map((item) => item.valueId)
    );
  }, [selectedPairs, form]);

  return (
    <section className="p-3 bg-white rounded-lg">
      <p className="font-semibold flex space-x-1 mb-3">
        <Tag /> <span>Thông số</span>
      </p>

      {rowDatas.map((row, index) => (
        <div key={row.id}>
          <div className="flex space-x-2 items-center mb-2">
            {/* Combobox for choosing attribute */}
            <SearchCombobox
              searchPlaceholder="Chọn loại"
              list={attributes
                .filter(
                  (attr) =>
                    attr.id === row.attribute?.id ||
                    !rowDatas.map((r) => r.attribute?.id || 0).includes(attr.id)
                )
                .map((attr) => ({
                  value: attr.id,
                  label: attr.name,
                }))}
              initialValue={row.attribute?.id}
              onItemSelect={(item) => {
                const lastAttribute = row.attribute;
                const selectedAttribute = attributes.find(
                  (attr) => attr.id === item.value
                );
                // Cập nhật lại attribute cho row này
                setRowDatas([
                  ...rowDatas.map((r) =>
                    r.id === row.id
                      ? { id: row.id, attribute: selectedAttribute }
                      : r
                  ),
                ]);
                // if this is attribute changing -> Remove the old selected pair attributeId - valueId
                if (lastAttribute) {
                  setSelectedPairs([
                    ...selectedPairs.filter(
                      (pair) => pair.attributeId !== lastAttribute.id
                    ),
                  ]);
                }
              }}
              className="bg-white p-5 rounded-md w-full flex-1"
            ></SearchCombobox>
            <SearchCombobox
              searchPlaceholder="Chọn giá trị"
              list={
                row.attribute?.values.map((item) => ({
                  value: item.id,
                  label: item.value,
                })) || []
              }
              onItemSelect={(item) => {
                if (
                  selectedPairs.some(
                    (pair) => pair.attributeId === row.attribute!.id
                  )
                ) {
                  setSelectedPairs([
                    ...selectedPairs.map((pair) =>
                      pair.attributeId === row.attribute!.id
                        ? {
                            attributeId: row.attribute!.id,
                            valueId: item.value,
                          }
                        : pair
                    ),
                  ]);
                } else {
                  selectedPairs.splice(index, 0, {
                    attributeId: row.attribute!.id,
                    valueId: item.value,
                  });
                  setSelectedPairs([...selectedPairs]);
                }
              }}
              className="bg-white p-5 rounded-md w-full flex-1"
            ></SearchCombobox>
            <div
              className="h-full bg-red-100 p-2 rounded-sm"
              onClick={() => {
                setRowDatas([...rowDatas.filter((r) => r.id !== row.id)]);
                setSelectedPairs([
                  ...selectedPairs.filter(
                    (pair) => pair.attributeId !== row.attribute?.id
                  ),
                ]);
              }}
            >
              <Trash className="text-red-400 cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </div>
      ))}
      <div
        className="w-full p-2 flex space-x-2 bg-primary-light text-primary font-semibold round-sm cursor-pointer"
        onClick={() => {
          if (rowDatas.some((row) => !row.attribute)) return;
          setRowDatas([...rowDatas, { id: nanoid(), attribute: undefined }]);
        }}
      >
        <Plus /> <span>Giá trị</span>
      </div>
      <p className="text-red-300">
        {form.getFieldState("valueIds").error?.message}
      </p>
    </section>
  );
}

export function WholesaleSection({
  form,
  fields,
  onAdd,
  onRemove,
}: {
  form: UseFormReturn<FormValues>;
  fields: (z.infer<typeof wholesaleSchema>["details"][number] & {
    id: string;
  })[];
  onAdd: (data: {
    min: number;
    max?: number;
    desc: string;
    price: number;
  }) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="p-3 bg-white rounded-lg">
      <p className="font-semibold flex space-x-1 mb-3">
        <Wallet /> <span>Bảng giá</span>
      </p>
      <div className="flex space-x-2">
        <FormField
          name="wholesale.min_quantity"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <LocalFormLabel>Mua tối thiểu</LocalFormLabel>
              <FormControl>
                <Input
                  type="number"
                  isError={fieldState.invalid}
                  {...field}
                  min="1"
                  onChange={(e) =>
                    form.setValue(
                      "wholesale.min_quantity",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="wholesale.max_quantity"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <LocalFormLabel>Mua tối đa</LocalFormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  isError={fieldState.invalid}
                  min="1"
                  onChange={(e) =>
                    form.setValue(
                      "wholesale.max_quantity",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="wholesale.unit"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <LocalFormLabel>Đơn vị</LocalFormLabel>
              <FormControl>
                <Input type="text" {...field} isError={fieldState.invalid} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="wholesale.quantity_step"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <LocalFormLabel>Bội số</LocalFormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  isError={fieldState.invalid}
                  min="1"
                  onChange={(e) =>
                    form.setValue(
                      "wholesale.quantity_step",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="wholesale.vat"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <LocalFormLabel>VAT (%)</LocalFormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  isError={fieldState.invalid}
                  min="0"
                  onChange={(e) =>
                    form.setValue(
                      "wholesale.vat",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Details array */}
      <Separator className="my-4" />
      <div className="flex pr-10 mb-2">
        <p className="flex-1 font-semibold opacity-50 text-sm ">Từ</p>
        <p className="flex-1 font-semibold opacity-50 text-sm ">Giá</p>
        <p className="flex-1 font-semibold opacity-50 text-sm ">Mô tả</p>
      </div>
      {fields.map((fieldItem, index: number) => (
        <div key={fieldItem.id} className="flex space-x-2 items-center mb-2">
          <FormField
            control={form.control}
            name={`wholesale.details.${index}.min`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    isError={false}
                    placeholder="Min"
                    min="1"
                    {...field}
                    onChange={(e) => {
                      form.setValue(
                        `wholesale.details.${index}.min`,
                        Number(e.currentTarget.value)
                      );
                      form.setValue(
                        `wholesale.details.${index}.desc`,
                        `${e.currentTarget.value}+`
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`wholesale.details.${index}.price`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    isError={false}
                    placeholder="Giá"
                    min="0"
                    {...field}
                    icon={<span className="px-4 border-l-2 shrink-0">VND</span>}
                    iconAlign="end"
                    onChange={(e) => {
                      form.setValue(
                        `wholesale.details.${index}.price`,
                        Number(e.currentTarget.value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`wholesale.details.${index}.desc`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    isError={false}
                    placeholder="Mô tả"
                    {...field}
                    disable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="h-full bg-red-100 p-2 rounded-sm">
            <Trash
              className="text-red-400 cursor-pointer hover:text-red-500"
              onClick={() => onRemove(index)}
            />
          </div>
        </div>
      ))}

      <div
        className="w-full p-2 flex space-x-2 bg-primary-light text-primary font-semibold round-sm cursor-pointer"
        onClick={() => {
          const last = form.getValues("wholesale.details").findLast(() => true);
          const nextMin = last ? Number(last.min) + 1 : 1;
          onAdd({ min: nextMin, desc: `${nextMin}+`, price: 0 });
        }}
      >
        <Plus /> <span>Giá</span>
      </div>
    </section>
  );
}

export function MediaSection({
  onPosterChange,
  onGalleryChange,
}: {
  onPosterChange: (file: File) => void;
  onGalleryChange: (files: File[]) => void;
}) {
  const { openModal, closeModal } = useModalActions();
  const [poster, setPoster] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    onGalleryChange(galleryFiles);
  }, [galleryFiles, onGalleryChange]);

  return (
    <section className="p-3 bg-white rounded-lg mb-2">
      <p className="font-semibold flex space-x-1 mb-3">
        <Images /> <span>Ảnh</span>
      </p>
      <div className="flex space-x-4">
        <div>
          <label
            htmlFor="poster"
            className="relative flex rounded-md border-1 size-44 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary overflow-hidden"
          >
            {poster ? (
              <Image
                src={poster}
                width={200}
                height={200}
                alt="Poster"
                className="absolute rounded-md inset-0"
              />
            ) : (
              <>
                <Upload /> <span className="font-semibold">Tải ảnh</span>
              </>
            )}
          </label>
          <input
            id="poster"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.currentTarget.files) {
                openModal({
                  type: "imageCropper",
                  props: {
                    file: e.currentTarget.files[0],
                    onImageComplete: (file, previewUrl) => {
                      setPoster(previewUrl);
                      onPosterChange(file);
                      closeModal();
                    },
                  },
                });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <div key={index}>
              <label
                htmlFor={`gallery-${index}`}
                className="relative flex rounded-md border-1 size-20 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary"
              >
                <ImagePlus />
                <Image
                  src={item}
                  width={100}
                  height={100}
                  alt="Gallery item"
                  className="absolute rounded-md inset-0"
                />
              </label>
              <input
                id={`gallery-${index}`}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.currentTarget.files) {
                    openModal({
                      type: "imageCropper",
                      props: {
                        file: e.currentTarget.files[0],
                        onImageComplete: (file, previewUrl) => {
                          gallery.splice(index, 1, previewUrl);
                          galleryFiles.splice(index, 1, file);
                          setGallery([...gallery]);
                          setGalleryFiles([...galleryFiles]);
                          closeModal();
                        },
                      },
                    });
                  }
                }}
              />
            </div>
          ))}
          <div>
            <label
              htmlFor={`gallery`}
              className="relative flex rounded-md border-1 size-20 cursor-pointer items-center justify-center space-x-2 bg-primary-light text-primary"
            >
              <ImagePlus />
            </label>
            <input
              id={`gallery`}
              type="file"
              accept="image/*"
              hidden
              multiple={true}
              onChange={(e) => {
                if (e.currentTarget.files) {
                  openModal({
                    type: "imageCropper",
                    props: {
                      file: e.currentTarget.files[0],
                      onImageComplete: (file, previewUrl) => {
                        setGallery([...gallery, previewUrl]);
                        setGalleryFiles([...galleryFiles, file]);
                        closeModal();
                      },
                    },
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
