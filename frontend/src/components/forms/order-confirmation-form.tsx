"use client";
import ClampText from "@/components/common/clamp-text";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/utils/number";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  addressId: z.string(),
  payment: z.string(),
});

const address = [
  {
    id: "shop",
    name: "Tại cửa hàng",
    detail: "1200 Hàm Nghi, Bến Nghé, Quận 1, HCM",
  },
  { id: "1", name: "Nhà", detail: "600 Quang Trung, P11, Gò Vấp, HCM" },
];

const payment = [
  { title: "Thanh toán qua VietQR", name: "vietqr" },
  // { title: "Thanh toán qua VNPay", name: "vnpay" },
];

export default function OrderConfirmationForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  return (
    <div className="flex">
      <Form {...form}>
        <form className="w-[400px]">
          <div className="space-y-2">
            <FormField
              name="addressId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ nhận hàng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-fit py-6">
                        {" "}
                        <SelectValue placeholder="Chọn địa chỉ nhận hàng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {address.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex flex-col items-start">
                            <p className="font-medium">{item.name}</p>
                            <ClampText lines={1} text={item.detail} showTitle />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="bg-primary-light cursor-pointer px-2 py-1 rounded-sm ms-auto w-fit">
              Thêm địa chỉ
            </div>
          </div>
          <FormField
            name="payment"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="my-4">Phương thức thanh toán</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="space-y-2"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {payment.map((item) => (
                      <FormItem key={item.name} className="flex space-x-2">
                        <FormControl className="cursor-pointer">
                          <RadioGroupItem value={item.name} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {item.title}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="border-s-4 ms-4 ps-4 flex flex-col w-[350px]">
        <div className="min-h-[200px] max-h-[250px] overflow-y-scroll app space-y-2">
          <ProductItem></ProductItem>
          <ProductItem></ProductItem>
          <ProductItem></ProductItem>
          <ProductItem></ProductItem>
          <ProductItem></ProductItem>
        </div>
        <div className="w-full h-[4px] bg-background my-4"></div>
        <div className="flex justify-between">
          <span className="text-xl font-bold">Tổng:</span>
          <span className="font-bold">{formatPrice(876000)} VNĐ</span>
        </div>
        <Link
          href="https://img.vietqr.io/image/ACB-31287527-print.png?amount=10000&addInfo=ORDER PAYMENT&accountName=Nguyen Nhat Kha"
          target="_blank"
          className="text-center w-full rounded-md p-2 bg-black text-white cursor-pointer my-2 opacity-90 hover:opacity-100"
        >
          Thanh toán
        </Link>
      </div>
    </div>
  );
}

interface ProductItemProps {
  className?: string;
}

const ProductItem: React.FC<ProductItemProps> = ({}) => {
  return (
    <div className="flex space-x-2 border p-2">
      <Image
        src={"/uploads/ic.jpg"}
        alt="IC"
        width={200}
        height={200}
        className="w-16 object-cover"
      />
      <div>
        <ClampText
          lines={1}
          showTitle
          text="ESP8266 Rasperry Nano"
          className="font-medium"
        />
        <p className="text-sm opacity-50">99.000đ/Cái</p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <p className="font-medium opacity-50">x2</p>
        <p className="font-medium">198.000</p>
      </div>
    </div>
  );
};
