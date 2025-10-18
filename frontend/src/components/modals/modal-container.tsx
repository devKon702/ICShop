"use client";
import ImageCropper from "@/components/common/image-cropper";
import CreateAttributeForm from "@/components/features/attribute/admin/create-attribute-form";
import CreateValueForm from "@/components/features/attribute/admin/create-value-form";
import CreateProductForm from "@/components/features/product/forms/create/create-product-form";
import AlertModal from "@/components/modals/alert-modal";
import FormModal from "@/components/modals/form-modal";
import { useModal } from "@/store/modal-store";
import CreateCategoryForm from "@/components/features/category/forms/create-category-form";
import PromptForm from "@/components/common/promt-form";
import AuthTabs from "@/components/features/auth/auth-tabs";
import CreateAddressForm from "@/components/features/address/create-address-form";
import UpdateAddressForm from "@/components/features/address/update-address-form";
import SafeImage from "@/components/common/safe-image";
import { bankAccount } from "@/constants/shop";
import OrderConfirmationForm from "@/components/features/order/user/order-confirmation-form";
import AdminOrderDetail from "@/components/features/order/admin/admin-order-detail";

export default function ModalContainer() {
  const modal = useModal();
  return (
    <>
      {modal.map((item, index) => (
        <div key={index} className="fixed inset-0">
          {(() => {
            switch (item.type) {
              case "alert":
                return <AlertModal {...item.props} />;
              case "prompt":
                return (
                  <FormModal title={item.props.title}>
                    <PromptForm {...item.props} />
                  </FormModal>
                );
              case "createCategory":
                return (
                  <FormModal title="Tạo danh mục">
                    <CreateCategoryForm {...item.props} />
                  </FormModal>
                );
              case "createAttribute":
                return (
                  <FormModal title="Thêm thông số">
                    <CreateAttributeForm {...item.props} />
                  </FormModal>
                );
              case "createValue":
                return (
                  <FormModal title="Thêm giá trị thông số">
                    <CreateValueForm {...item.props} />
                  </FormModal>
                );
              case "createProduct":
                return (
                  <FormModal title="Tạo Sản Phẩm">
                    <CreateProductForm {...item.props} />
                  </FormModal>
                );
              case "imageCropper":
                return (
                  <FormModal title="Chỉnh sửa ảnh">
                    <ImageCropper {...item.props} />
                  </FormModal>
                );
              case "auth":
                return (
                  <FormModal>
                    <AuthTabs />
                  </FormModal>
                );
              case "createAddress":
                return (
                  <FormModal title="Thêm địa chỉ">
                    <CreateAddressForm />
                  </FormModal>
                );
              case "updateAddress":
                return (
                  <FormModal title="Cập nhật địa chỉ">
                    <UpdateAddressForm address={item.props.address} />
                  </FormModal>
                );
              case "orderConfirmation":
                return (
                  <FormModal title="Xác nhận đơn hàng">
                    <OrderConfirmationForm />
                  </FormModal>
                );
              case "qrCode":
                return (
                  <FormModal>
                    <div className="p-4 aspect-square w-[80dvh]">
                      <SafeImage
                        src={`https://img.vietqr.io/image/${bankAccount.bankName}-${bankAccount.accountNumber}-print.png?amount=${item.props.amount}&addInfo=${item.props.qrString}&accountName=${bankAccount.accountHolder}`}
                        alt="QR Code"
                        width={300}
                        height={300}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </FormModal>
                );
              case "adminOrderDetail":
                return (
                  <FormModal title="Chi tiết đơn hàng">
                    <AdminOrderDetail orderId={item.props.orderId} />
                  </FormModal>
                );
              default:
                return null;
            }
          })()}
        </div>
      ))}
    </>
  );
}
