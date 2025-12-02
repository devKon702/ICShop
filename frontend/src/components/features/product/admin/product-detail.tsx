import ClampText from "@/components/common/clamp-text";
import SafeImage from "@/components/common/safe-image";
import Separator from "@/components/common/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import env from "@/constants/env";
import productService from "@/libs/services/product.service";
import { formatIsoDateTime } from "@/utils/date";
import { formatPrice } from "@/utils/price";
import { sanitizeHtml } from "@/utils/sanitize";
import { useQuery } from "@tanstack/react-query";
import {
  Blocks,
  CircleCheck,
  CircleX,
  ImageIcon,
  Tag,
  Wallet,
} from "lucide-react";
import React from "react";

interface Props {
  productId: number;
}

export default function ProductDetail({ productId }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", { id: productId }],
    queryFn: () => productService.admin.getById(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading product details.</div>;
  }

  if (!data) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="grid grid-cols-2 p-2 w-[70dvw] max-h-[90dvh] overflow-y-auto gap-4 app">
      <div className="space-y-4">
        {/* Basic Information */}
        <ProductSection title="Thông Tin Cơ Bản" icon={<Blocks></Blocks>}>
          <div>
            <ProductField
              label="Tên Sản Phẩm"
              value={data?.data.name}
              lines={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ProductField label="Danh mục" value={data.data.category.name} />
            <ProductField
              label="Giá hiển thị"
              value={formatPrice(Number(data.data.price)) + " vnđ"}
            />
            <ProductField
              label="Trạng thái"
              value={
                <div
                  data-state={data.data.isActive}
                  className="flex gap-2 items-center bg-gray-600/10 text-black data-[state=true]:bg-primary data-[state=true]:text-white text-center rounded-full px-2 py-1 font-semibold min-w-1/4"
                >
                  {data.data.isActive ? <CircleCheck /> : <CircleX />}
                  {data.data.isActive ? "Kích hoạt" : "Ẩn"}
                </div>
              }
            />

            <ProductField
              label="Ngày tạo"
              value={formatIsoDateTime(data.data.createdAt)}
            />
          </div>
          <div>
            <ProductField
              label="Mô Tả"
              value={
                data.data.desc ? (
                  <div
                    className="tiptap max-h-48 overflow-auto w-full"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(data.data.desc),
                    }}
                  />
                ) : (
                  "-"
                )
              }
            />
          </div>
        </ProductSection>
        {/* Attributes */}
        <ProductSection title="Thông Số" icon={<Tag></Tag>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.attributes.map((attr) => (
                <TableRow key={attr.id}>
                  <TableCell className="p-2 border-b">
                    {attr.attributeValue.attribute.name}
                  </TableCell>
                  <TableCell className="p-2 border-b">
                    {attr.attributeValue.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ProductSection>
      </div>
      <div className="space-y-4">
        {/* Images */}
        <ProductSection title="Ảnh Sản Phẩm" icon={<ImageIcon></ImageIcon>}>
          <div className="flex gap-2">
            <SafeImage
              key={`${env.NEXT_PUBLIC_FILE_URL}/${data.data.posterUrl}`}
              src={`${env.NEXT_PUBLIC_FILE_URL}/${data.data.posterUrl}`}
              alt="Poster"
              width={150}
              height={150}
              className="rounded-md shadow border"
            />
            <div className="flex-1 flex flex-wrap">
              {data.data.images.map((image) => (
                <div key={image.id} className="p-1">
                  <SafeImage
                    key={`${env.NEXT_PUBLIC_FILE_URL}/${image.imageUrl}`}
                    src={`${env.NEXT_PUBLIC_FILE_URL}/${image.imageUrl}`}
                    alt={"Product Image"}
                    width={75}
                    height={75}
                    className="rounded-md shadow border"
                  />
                </div>
              ))}
            </div>
          </div>
        </ProductSection>
        {/* Wholesale */}
        <ProductSection title="Bảng Giá" icon={<Wallet></Wallet>}>
          <div className="flex justify-between w-full">
            <ProductField
              label="Tối thiểu"
              value={data.data.wholesale.min_quantity}
            />
            <ProductField
              label="Tối đa"
              value={data.data.wholesale.max_quantity}
            />
            <ProductField label="Đơn vị" value={data.data.wholesale.unit} />
            <ProductField
              label="Bội số"
              value={data.data.wholesale.quantity_step}
            />
            <ProductField label="VAT (%)" value={data.data.wholesale.vat} />
          </div>
          <Separator />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá bán (vnđ)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.wholesale.details.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell className="p-2 border-b">{detail.desc}</TableCell>
                  <TableCell className="p-2 border-b">
                    {formatPrice(Number(detail.price))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ProductSection>
      </div>
    </div>
  );
}

function ProductSection({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-white shadow border overflow-hidden w-full">
      <h2 className="text-lg font-semibold flex items-center bg-primary/10 text-primary p-2">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <div className="p-2 space-x-2 space-y-2">{children}</div>
    </section>
  );
}

function ProductField({
  label,
  value,
  lines = 1,
}: {
  label: string;
  value: string | null | React.ReactNode;
  lines?: number;
}) {
  return (
    <div className="flex flex-col items-start w-full">
      <span className="font-semibold opacity-50 text-sm">{label}</span>
      {typeof value === "string" || value === null ? (
        <ClampText
          lines={lines}
          text={value ? value : "-"}
          showTitle
          className="font-semibold"
        />
      ) : (
        <>{value}</>
      )}
    </div>
  );
}
