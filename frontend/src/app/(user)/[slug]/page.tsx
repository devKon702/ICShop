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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return;
  return {
    title: product.name,
    description: `${
      product.name
    } mua ngay với giá chỉ ${product.activeWholesale?.details?.find(
      () => true
    )}`,
  };
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) notFound();
  return (
    <>
      <SetBreadCrump
        breadcrumps={[
          { label: "Trang chủ", href: ROUTE.home },
          {
            label: product.category?.parent?.parent?.name || "",
            href: ROUTE.category + "/" + product.category?.parent?.parent?.slug,
          },
          {
            label: product.category?.parent?.name || "",
            href: ROUTE.category + "/" + product.category?.parent?.slug,
          },
          {
            label: product.category?.name || "",
            href: ROUTE.category + "/" + product.category?.slug,
          },
          {
            label: product.name,
            href: product.slug,
          },
        ]}
      ></SetBreadCrump>
      <div className="grid grid-cols-12 w-full space-x-2">
        <ProductMediaGallery></ProductMediaGallery>
        <div className="col-span-8 p-2 rounded-md bg-white space-y-2">
          <p className="text-3xl">{product.name}</p>
          <div className="space-x-2">
            <span className="font-bold">Thương hiệu:</span>
            <span>MicroIO</span>
          </div>
          <div className="space-x-2">
            <span className="font-bold">Mã sản phẩm:</span>
            <span>CL38X70</span>
          </div>
          <div className="space-x-2">
            <span className="font-bold">Datasheet:</span>
            <Link href={"#"} className="hover:underline text-primary">
              Tại đây
            </Link>
          </div>

          <div className="flex justify-between w-full space-x-2">
            <div className="flex flex-col space-y-2 w-5/12 mt-auto">
              <span className="font-bold">Số lượng:</span>
              <AddToCartForm></AddToCartForm>
              <button className="bg-primary hover:opacity-90 py-2 cursor-pointer rounded-sm">
                <i className="bx bxs-cart me-2 pointer-events-none"></i>
                Thêm vào giỏ hàng
              </button>
            </div>
            <div className="w-5/12">
              <ProductWholesaleTable></ProductWholesaleTable>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-white p-2 mt-2 pb-6">
        <h2 className="font-bold text-xl my-4">Thông số</h2>
        <div>
          <ProductAttributeTable></ProductAttributeTable>
        </div>

        <h2 className="font-bold text-xl my-4">Mô tả chi tiết</h2>
        <div className="space-y-3">
          <p>
            LUA ESP8266 CH340 WIFI có WiFi nối tiếp được tích hợp trên bo mạch
            để cung cấp tài nguyên trong tầm tay của bạn, nối tiếp USB-TTL tích
            hợp với độ bền công nghiệp siêu đáng tin cậy, tất cả các nền tảng
            được hỗ trợ.
          </p>
          <p>
            Mô-đun này là một trong những mô-đun wifi có sẵn rẻ nhất trên thị
            trường. Version3 là phiên bản mới của mạch sử dụng CH340G thay cho
            CP2102.
          </p>

          <h3>Thông số kỹ thuật:</h3>
          <ul className="list-inside list-disc">
            <li>
              NodeMCU có cổng USB-TTL với IC CH340G hoạt động ổn định với chuẩn
              công nghiệp.
            </li>
            <li>Điện áp giao tiếp: 3.3 VDC,</li>
            <li>Loại ăngten: Ăng ten PCB tích hợp trên mạch.</li>
            <li>Chuẩn 802.11 b / g / n không dây,</li>
            <li>WiFi 2.4GHz, hỗ trợ chế độ bảo mật WPA / WPA2</li>
            <li>Hỗ trợ 3 chế độ hoạt động STA / AP / STA + AP</li>
            <li>
              Tích hợp giao thức TCP / IP để hỗ trợ nhiều kết nối TCP Client (5
              MAX)
            </li>
            <li>
              D0 → D8, SD1 → SD3: sử dụng như GPIO, PWM, IIC, v.v, dòng điều
              khiển 15mA
            </li>
            <li>AD0: 1 kênh ADC</li>
            <li>Nguồn vào: 4.5V ~ 9V (10VMAX), nguồn từ cổng USB</li>
            <li>
              Dòng tiêu thụ: truyền liên tục: ≈70mA (200mA MAX), chế độ chờ:
              &lt;200uA
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
