"use client";
import { LocationBaseSchema } from "@/libs/schemas/location.schema";
import addressService from "@/libs/services/address.service";
import { useModalActions } from "@/store/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, Trash, User } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

interface AddressItemProps {
  address: {
    id: number;
    alias: string;
    receiverName: string;
    receiverPhone: string;
    province: z.infer<typeof LocationBaseSchema>;
    district: z.infer<typeof LocationBaseSchema>;
    ward: z.infer<typeof LocationBaseSchema>;
    detail: string;
  };
}

export default function AddressItem({ address }: AddressItemProps) {
  const { openModal } = useModalActions();
  const queryClient = useQueryClient();
  const { mutate: deleteAddressMutate } = useMutation({
    mutationFn: async () => addressService.delete(address.id),
    onSuccess: () => {
      toast.success("Xoá địa chỉ thành công");
      queryClient.invalidateQueries({ queryKey: ["address", "me"] });
    },
    onError: (err) => {
      toast.error("Xoá địa chỉ thất bại");
      console.log(err);
    },
  });
  return (
    <div
      className="flex space-x-2 items-center p-2 rounded-md shadow-sm cursor-pointer hover:bg-primary/10"
      onClick={() =>
        openModal({
          type: "updateAddress",
          props: {
            address: {
              alias: address.alias,
              wardId: address.ward.id,
              districtId: address.district.id,
              provinceId: address.province.id,
              receiverName: address.receiverName,
              receiverPhone: address.receiverPhone,
              detail: address.detail,
              id: address.id,
            },
            onSuccess: () => {},
          },
        })
      }
    >
      <div className="space-y-2 flex-1">
        <p className="font-medium text-xl">{address.alias}</p>
        <div className="flex space-x-2 items-center">
          <MapPin size={"1rem"} />
          <p className="font-light text-sm">{`${address.detail}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`}</p>
        </div>
        <div className="flex space-x-4">
          <span className="flex items-center">
            <User size="1rem" className="me-2" />
            {
              <address className="font-light text-sm">
                {address.receiverName}
              </address>
            }
          </span>
          <span className="flex items-center">
            <Phone size="1rem" className="me-2" />
            {
              <address className="font-light text-sm">
                {address.receiverPhone}
              </address>
            }
          </span>
        </div>
      </div>
      <div>
        <Trash
          className="size-10 p-2 hover:bg-red-500/10 text-red-500 rounded-md cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Bạn có chắc muốn xoá địa chỉ ${address.alias}?`)) {
              deleteAddressMutate();
            }
          }}
        />
      </div>
    </div>
  );
}
