import LoadingIcon from "@/components/common/loading-icon";
import UpdateBasicForm from "@/components/features/product/admin/forms/update/update-basic-form";
import UpdateCategoryForm from "@/components/features/product/admin/forms/update/update-category-form";
import UpdateImageForm from "@/components/features/product/admin/forms/update/update-image-form";
import UpdateWholesaleForm from "@/components/features/product/admin/forms/update/update-wholesale-form";
import productService from "@/libs/services/product.service";
import { sanitizeHtml } from "@/utils/sanitize";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  productId: number;
  onSuccess?: () => void;
}

export default function UpdateProductForm({ productId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["product", { id: productId }],
    queryFn: () => productService.admin.getById(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  if (isLoading) {
    return (
      <div className="w-full h-32">
        <LoadingIcon />
      </div>
    );
  }
  if (data) {
    return (
      <div>
        <div className="space-y-2 max-h-96 overflow-y-auto app p-2 w-fit">
          <UpdateBasicForm
            productId={productId}
            name={data.data.name}
            desc={
              typeof data.data.desc === "string"
                ? sanitizeHtml(data.data.desc)
                : null
            }
            datasheetLink={data.data.datasheetLink || null}
            weight={data.data.weight}
          />
          <UpdateCategoryForm
            productId={productId}
            category={data.data.category}
            productValues={data.data.attributes.map((item) => ({
              id: item.attributeValue.id,
              value: item.attributeValue.value,
              attribute: {
                id: item.attributeValue.attribute.id,
                name: item.attributeValue.attribute.name,
              },
            }))}
          />
          <UpdateWholesaleForm
            productId={productId}
            wholesale={{
              min_quantity: data.data.wholesale.min_quantity,
              max_quantity: data.data.wholesale.max_quantity,
              unit: data.data.wholesale.unit,
              quantity_step: data.data.wholesale.quantity_step,
              vat: Number(data.data.wholesale.vat),
              details: data.data.wholesale.details.map((item) => ({
                min: item.min,
                max: null,
                price: Number(item.price),
                desc: item.desc,
              })),
            }}
          />
          <UpdateImageForm
            productId={productId}
            posterUrl={data.data.posterUrl ?? ""}
            gallery={data.data.images.map((item) => ({
              id: item.id,
              url: item.imageUrl,
            }))}
          />
        </div>
      </div>
    );
  }
}
