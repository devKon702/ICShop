import SetBreadCrump from "@/components/common/set-breadcrump";
import ProductAttributeTable from "@/components/features/product/product-attribute-table";
import ProductMediaGallery from "@/components/features/product/product-media-gallery";
import ProductWholesaleTable from "@/components/features/product/product-wholesale-table";
import AddToCartForm from "@/components/features/cart/add-to-cart-form";
import { ROUTE } from "@/constants/routes";
import productService from "@/libs/services/product.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { formatPrice } from "@/utils/price";
import tryCatch from "@/utils/try-catch";
import { sanitizeHtml } from "@/utils/sanitize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: product } = await productService.user.getBySlug(slug);
  if (!product) return notFound();
  return {
    title: product.name,
    description: `${product.name} mua ngay với giá chỉ ${formatPrice(
      Number(product.price)
    )}`,
    keywords: product.name,
  };
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, error] = await tryCatch(productService.user.getBySlug(slug));
  if (error) notFound();
  return (
    <>
      <SetBreadCrump
        breadcrumps={[
          { label: "Trang chủ", href: ROUTE.home },
          {
            label: product.data.category.parent.parent.name || "",
            href:
              ROUTE.category +
              "/" +
              product.data.category?.parent?.parent?.slug,
          },
          {
            label: product.data.category.parent.name || "",
            href: ROUTE.category + "/" + product.data.category?.parent?.slug,
          },
          {
            label: product.data.category.name || "",
            href: ROUTE.category + "/" + product.data.category?.slug,
          },
          {
            label: product.data.name,
            href: product.data.slug,
          },
        ]}
      />
      <div className="grid grid-cols-12 w-full space-x-2">
        <ProductMediaGallery
          imageUrls={[
            product.data.posterUrl || "",
            ...product.data.images.map((img) => img.imageUrl),
          ]}
        />
        <div className="col-span-8 p-2 rounded-md bg-white space-y-2">
          <p className="text-3xl">{product.data.name}</p>
          {product.data.datasheetLink && (
            <Link
              href={product.data.datasheetLink}
              target="_blank"
              className="hover:underline text-primary"
            >
              Datasheet
            </Link>
          )}

          <div className="flex justify-between w-full space-x-2">
            <div className="flex flex-col space-y-2 w-5/12 mt-auto">
              <span className="font-bold">Số lượng:</span>
              <AddToCartForm
                min={product.data.wholesale.min_quantity}
                max={product.data.wholesale.max_quantity}
                step={product.data.wholesale.quantity_step}
                productId={product.data.id}
              />
            </div>
            <div className="w-5/12">
              <ProductWholesaleTable
                detail={product.data.wholesale.details.map((item) => ({
                  min: item.min,
                  price: Number(item.price),
                  desc: item.desc,
                }))}
                unit={product.data.wholesale.unit}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-white p-2 mt-2 pb-6">
        <h2 className="font-bold text-xl my-4">Thông số</h2>
        <div>
          <ProductAttributeTable
            attributes={product.data.attributes.map((item) => ({
              id: item.id,
              name: item.attributeValue.attribute.name,
              value: item.attributeValue.value,
            }))}
          />
        </div>
        {product.data.desc && (
          <>
            <h2 className="font-bold text-xl my-4">Mô tả chi tiết</h2>
            <div className="space-y-3">
              <div
                className="whitespace-pre-line tiptap"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(product.data.desc || ""),
                }}
              ></div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
