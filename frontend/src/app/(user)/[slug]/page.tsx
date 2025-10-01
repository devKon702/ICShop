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
import { formatPrice } from "@/utils/number";

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
  const { data: product } = await productService.user.getBySlug(slug);
  if (!product) notFound();
  return (
    <>
      <SetBreadCrump
        breadcrumps={[
          { label: "Trang chủ", href: ROUTE.home },
          {
            label: product.category.parent.parent.name || "",
            href: ROUTE.category + "/" + product.category?.parent?.parent?.slug,
          },
          {
            label: product.category.parent.name || "",
            href: ROUTE.category + "/" + product.category?.parent?.slug,
          },
          {
            label: product.category.name || "",
            href: ROUTE.category + "/" + product.category?.slug,
          },
          {
            label: product.name,
            href: product.slug,
          },
        ]}
      ></SetBreadCrump>
      <div className="grid grid-cols-12 w-full space-x-2">
        <ProductMediaGallery
          imageUrls={[
            product.posterUrl || "",
            ...product.images.map((img) => img.imageUrl),
          ]}
        ></ProductMediaGallery>
        <div className="col-span-8 p-2 rounded-md bg-white space-y-2">
          <p className="text-3xl">{product.name}</p>
          {/* <div className="space-x-2">
            <span className="font-bold">Thương hiệu:</span>
            <span>MicroIO</span>
          </div>
          <div className="space-x-2">
            <span className="font-bold">Mã sản phẩm:</span>
            <span>CL38X70</span>
          </div> */}
          {product.datasheetLink && (
            <Link
              href={product.datasheetLink}
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
                min={product.wholesale.min_quantity}
                max={product.wholesale.max_quantity}
                step={product.wholesale.quanity_step}
                productId={product.id}
              ></AddToCartForm>
            </div>
            <div className="w-5/12">
              <ProductWholesaleTable
                detail={product.wholesale.details.map((item) => ({
                  min: item.min,
                  price: Number(item.price),
                  desc: item.desc,
                }))}
                unit={product.wholesale.unit}
              ></ProductWholesaleTable>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-white p-2 mt-2 pb-6">
        <h2 className="font-bold text-xl my-4">Thông số</h2>
        <div>
          <ProductAttributeTable
            attributes={product.attributes.map((item) => ({
              id: item.id,
              name: item.attributeValue.attribute.name,
              value: item.attributeValue.value,
            }))}
          ></ProductAttributeTable>
        </div>
        {product.desc && (
          <>
            <h2 className="font-bold text-xl my-4">Mô tả chi tiết</h2>
            <div className="space-y-3">
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: product.desc,
                }}
              ></div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
