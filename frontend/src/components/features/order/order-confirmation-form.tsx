"use client";
import ClampText from "@/components/common/clamp-text";
import CustomInput from "@/components/common/custom-input";
import SafeImage from "@/components/common/safe-image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeliveryType } from "@/constants/enums";
import env from "@/constants/env";
import addressService from "@/libs/services/address.service";
import cartService from "@/libs/services/cart.service";
import orderService from "@/libs/services/order.service";
import { useCartActions, useSelectedProducts } from "@/store/cart-store";
import { useModalActions } from "@/store/modal-store";
import { formatPrice, getUnitPrice } from "@/utils/price";
import { phoneRegex, vietnameseRegex } from "@/utils/regex";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Phone, Plus, User } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const deliveryTypes = [
  { value: DeliveryType.SHOP, label: "Nhận tại cửa hàng" },
  { value: DeliveryType.POST, label: "Giao hàng" },
];

interface OrderConfirmationFormProps {
  onOrderSuccess?: () => void;
}
export default function OrderConfirmationForm({}: OrderConfirmationFormProps) {
  // Hooks
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalActions();
  const selectedProducts = useSelectedProducts();
  const { removeItem } = useCartActions();

  // State
  const [selectedDeliveryType, setSelectedDeliveryType] =
    React.useState<DeliveryType>(DeliveryType.SHOP);
  const [selectedAddressId, setSelectedAddressId] = React.useState<
    number | undefined
  >(undefined);
  const [receiver, setReceiver] = React.useState({ name: "", phone: "" });

  // Queries
  const { data: addressData } = useQuery({
    queryKey: ["address"],
    queryFn: () => addressService.getMyAddresses(),
  });

  // Mutations
  const { mutate: createOrderMutate, isPending } = useMutation({
    mutationFn: async () =>
      orderService.user.create({
        deliveryType: selectedDeliveryType,
        addressId: selectedAddressId,
        receiverName:
          selectedDeliveryType === DeliveryType.SHOP
            ? receiver.name
            : undefined,
        receiverPhone:
          selectedDeliveryType === DeliveryType.SHOP
            ? receiver.phone
            : undefined,
        products: selectedProducts.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
        })),
      }),
    onSuccess: (data) => {
      toast.success("Tạo đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      deleteCartItemMutate();
      closeModal();
      openModal({
        type: "qrCode",
        props: { qrString: data.data.code, amount: Number(data.data.total) },
      });
    },
    onError: (error) => {
      toast.error("Tạo đơn hàng thất bại");
      console.log(error);
    },
  });

  const { mutate: deleteCartItemMutate } = useMutation({
    mutationFn: async () =>
      cartService.deleteMulti(selectedProducts.map((p) => p.cartId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      selectedProducts.forEach((p) => removeItem(p.cartId));
    },
  });

  return (
    <div className="flex">
      <div className="space-y-2 min-w-lg">
        <Select
          value={selectedDeliveryType.toString()}
          onValueChange={(value) => setSelectedDeliveryType(Number(value))}
        >
          <SelectTrigger className="w-full h-fit py-6 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {deliveryTypes.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value.toString()}
                className="cursor-pointer hover:bg-primary/10"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedDeliveryType === DeliveryType.POST ? (
          <div>
            <Select
              onValueChange={(val) => {
                setSelectedAddressId(Number(val));
              }}
              defaultValue={selectedAddressId?.toString()}
            >
              <SelectTrigger className="w-full h-fit py-6 cursor-pointer">
                <SelectValue placeholder="Chọn địa chỉ nhận hàng" />
              </SelectTrigger>
              <SelectContent>
                {addressData?.data.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id.toString()}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-start">
                      <p className="font-medium">{item.alias}</p>
                      <ClampText
                        lines={1}
                        text={`${item.detail}, ${item.ward.name}, ${item.district.name}, ${item.province.name}`}
                        showTitle
                      />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="cursor-pointer px-2 py-1 rounded-sm ms-auto w-fit mt-2 flex items-center space-x-1"
              onClick={() => openModal({ type: "createAddress", props: {} })}
              type="button"
            >
              <Plus className="" />
              <span>Thêm địa chỉ</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <CustomInput
              icon={<User />}
              type="text"
              placeholder="Nhập họ tên"
              isError={false}
              autoFocus
              onChange={(e) =>
                setReceiver((prev) => ({ ...prev, name: e.target.value }))
              }
              value={receiver.name}
            ></CustomInput>

            <CustomInput
              icon={<Phone />}
              type="number"
              placeholder="Nhập số điện thoại"
              isError={false}
              autoFocus
              onChange={(e) =>
                setReceiver((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={receiver.phone}
            ></CustomInput>
          </div>
        )}
      </div>
      <div className="border-s-4 ms-4 ps-4 flex flex-col w-[350px]">
        <div className="min-h-[200px] max-h-[250px] overflow-y-scroll app space-y-2">
          {selectedProducts.map((item) => (
            <ProductItem
              key={item.id}
              product={{
                name: item.name,
                quantity: item.quantity,
                price: getUnitPrice(
                  item.quantity,
                  item.wholesale.details.map((d) => ({
                    min: d.min,
                    price: d.price,
                  }))
                ),
                posterUrl: item.posterUrl,
                unit: item.wholesale.unit,
              }}
            />
          ))}
        </div>
        <div className="w-full h-[4px] bg-background my-4"></div>
        <div className="flex justify-between">
          <span className="text-xl font-bold">Tổng:</span>
          <span className="font-bold">
            {formatPrice(
              selectedProducts
                .map(
                  (item) =>
                    getUnitPrice(
                      item.quantity,
                      item.wholesale.details.map((d) => ({
                        min: d.min,
                        price: d.price,
                      }))
                    ) * item.quantity
                )
                .reduce((a, b) => a + b, 0)
            )}
            VNĐ
          </span>
        </div>
        <Button
          className="text-center w-full rounded-md p-2 bg-black text-white cursor-pointer my-2 opacity-90 hover:opacity-100"
          disabled={isPending}
          onClick={() => {
            if (
              selectedDeliveryType === DeliveryType.POST &&
              !selectedAddressId
            ) {
              toast.error("Vui lòng chọn địa chỉ nhận hàng");
              return;
            }
            if (selectedDeliveryType === DeliveryType.SHOP) {
              if (vietnameseRegex().test(receiver.name) === false) {
                toast.error("Tên người nhận không hợp lệ");
                return;
              }
              if (phoneRegex().test(receiver.phone) === false) {
                toast.error(
                  "Số diện thoại không hợp lệ theo định dạng Việt Nam"
                );
                return;
              }
            }
            createOrderMutate();
          }}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}

interface ProductItemProps {
  product: {
    name: string;
    quantity: number;
    price: number;
    posterUrl: string;
    unit: string;
  };
}

const ProductItem: React.FC<ProductItemProps> = ({
  product: { name, quantity, price, posterUrl, unit },
}) => {
  return (
    <div className="flex space-x-2 border p-2">
      <SafeImage
        src={`${env.NEXT_PUBLIC_FILE_URL}/${posterUrl}`}
        alt={name}
        width={200}
        height={200}
        className="w-16 object-cover"
      />
      <div>
        <ClampText lines={1} showTitle text={name} className="font-medium" />
        <p className="text-sm opacity-50">
          {formatPrice(price)}/{unit}
        </p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <p className="font-medium opacity-50">x{quantity}</p>
        <p className="font-medium">{formatPrice(price * quantity)}</p>
      </div>
    </div>
  );
};
