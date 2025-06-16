import OrderConfirmationForm from "@/components/forms/order-confirmation-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export default function CartSummary() {
  return (
    <div>
      <p className="font-bold text-2xl mb-5">Tổng đơn hàng</p>
      <div className="my-2 space-x-2 flex justify-between">
        <span className="font-medium">Số lượng:</span>
        <span>3</span>
      </div>
      <div className="my-2 space-x-2 flex justify-between">
        <span className="font-medium">Tổng:</span>
        <span>247.000</span>
      </div>
      <div className="my-2 space-x-2 flex justify-between">
        <span className="font-medium">Thuế:</span>
        <span>0</span>
      </div>
      <div className="w-full h-[4px] bg-black"></div>
      <div className="my-2 space-x-2 flex justify-between">
        <span className="font-bold text-xl">Thành tiền:</span>
        <span>247.000</span>
      </div>
      <Dialog>
        <DialogTrigger className="w-full bg-primary font-bold text-white py-2 cursor-pointer opacity-80 hover:opacity-100">
          <span className="pointer-events-none">Xác nhận đơn hàng</span>
        </DialogTrigger>
        <DialogContent className="bg-white w-fit sm:max-w-11/12">
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
          </DialogHeader>
          <OrderConfirmationForm></OrderConfirmationForm>
        </DialogContent>
      </Dialog>
    </div>
  );
}
