"use client";
import ImageCropper from "@/components/common/image-cropper";
import CreateAttributeForm from "@/components/features/attribute/admin/create-attribute-form";
import CreateValueForm from "@/components/features/attribute/admin/create-value-form";
import CreateProductForm from "@/components/features/product/admin/forms/create/create-product-form";
import AlertModal from "@/components/modals/alert-modal";
import FormModal from "@/components/modals/form-modal";
import { useModal, useModalActions } from "@/store/modal-store";
import CreateCategoryForm from "@/components/features/category/forms/create-category-form";
import PromptForm from "@/components/common/promt-form";
import AuthTabs from "@/components/features/auth/auth-tabs";
import CreateAddressForm from "@/components/features/address/create-address-form";
import UpdateAddressForm from "@/components/features/address/update-address-form";
import SafeImage from "@/components/common/safe-image";
import { bankAccount } from "@/constants/shop";
import OrderConfirmationForm from "@/components/features/order/user/order-confirmation-form";
import AdminOrderDetail from "@/components/features/order/admin/admin-order-detail";
import ChangeOrderStatusForm from "@/components/features/order/admin/change-order-status-form";
import UpdateProductForm from "@/components/features/product/admin/forms/update/update-product-form";
import ProductDetail from "@/components/features/product/admin/product-detail";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import AddToHighlight from "@/components/features/product/admin/forms/add-to-highlight";
import AdminUserOrders from "@/components/features/order/admin/admin-user-orders";
import CreateCollectionForm from "@/components/features/collection/create-collection-form";
import AddToCollection from "@/components/features/product/admin/forms/add-to-collection";
import UserOrderDetail from "@/components/features/order/user/user-order-detail";
import ChangeOrderAddressForm from "@/components/features/address/change-order-address-form";

export default function ModalContainer() {
  const modal = useModal();
  const { openModal } = useModalActions();
  return (
    <>
      {modal.map((item, index) => (
        <div key={index}>
          {(() => {
            switch (item.type) {
              case "alert":
                return <AlertModal {...item.props} />;
              case "prompt":
                return (
                  <FormModal title={item.props.title} index={index}>
                    <PromptForm {...item.props} />
                  </FormModal>
                );
              case "createCategory":
                return (
                  <FormModal title="Tạo danh mục" index={index}>
                    <CreateCategoryForm {...item.props} />
                  </FormModal>
                );
              case "createAttribute":
                return (
                  <FormModal title="Thêm thông số" index={index}>
                    <CreateAttributeForm {...item.props} />
                  </FormModal>
                );
              case "createValue":
                return (
                  <FormModal title="Thêm giá trị thông số" index={index}>
                    <CreateValueForm {...item.props} />
                  </FormModal>
                );
              case "createProduct":
                return (
                  <FormModal title="Tạo Sản Phẩm" index={index} useCloseButton>
                    <CreateProductForm {...item.props} />
                  </FormModal>
                );
              case "updateProduct":
                return (
                  <FormModal
                    title="Cập Nhật Sản Phẩm"
                    index={index}
                    useCloseButton
                  >
                    <UpdateProductForm {...item.props} />
                  </FormModal>
                );
              case "productDetail":
                return (
                  <FormModal
                    title="Chi Tiết Sản Phẩm"
                    index={index}
                    titleExtraComponent={
                      <Button
                        className="float-right"
                        onClick={() => {
                          openModal({
                            type: "updateProduct",
                            props: { productId: item.props.productId },
                          });
                        }}
                      >
                        <Pencil />
                        Cập nhật
                      </Button>
                    }
                  >
                    <ProductDetail productId={item.props.productId} />
                  </FormModal>
                );
              case "addToHighlight":
                return (
                  <FormModal
                    title="Thêm vào mục nổi bật"
                    index={index}
                    useCloseButton
                  >
                    <AddToHighlight productId={item.props.productId} />
                  </FormModal>
                );
              case "addToCollection":
                return (
                  <FormModal
                    title="Thêm vào bộ sưu tập"
                    index={index}
                    useCloseButton
                  >
                    <AddToCollection productId={item.props.productId} />
                  </FormModal>
                );
              case "imageCropper":
                return (
                  <FormModal title="Chỉnh sửa ảnh" index={index}>
                    <ImageCropper {...item.props} />
                  </FormModal>
                );
              case "auth":
                return (
                  <FormModal index={index}>
                    <AuthTabs />
                  </FormModal>
                );
              case "createAddress":
                return (
                  <FormModal title="Thêm địa chỉ" index={index}>
                    <CreateAddressForm />
                  </FormModal>
                );
              case "updateAddress":
                return (
                  <FormModal
                    title="Cập nhật địa chỉ"
                    index={index}
                    useCloseButton
                  >
                    <UpdateAddressForm address={item.props.address} />
                  </FormModal>
                );
              case "orderConfirmation":
                return (
                  <FormModal
                    title="Xác nhận đơn hàng"
                    index={index}
                    useCloseButton
                  >
                    <OrderConfirmationForm />
                  </FormModal>
                );
              case "qrCode":
                return (
                  <FormModal index={index}>
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
                  <FormModal title="Chi tiết đơn hàng" index={index}>
                    <AdminOrderDetail orderId={item.props.orderId} />
                  </FormModal>
                );
              case "userOrderDetail":
                return (
                  <FormModal title="Chi tiết đơn hàng" index={index}>
                    <UserOrderDetail orderId={item.props.orderId} />
                  </FormModal>
                );
              case "changeOrderAddress":
                return (
                  <FormModal title="Chọn địa chỉ" index={index} useCloseButton>
                    <ChangeOrderAddressForm {...item.props} />
                  </FormModal>
                );
              case "changeOrderStatus":
                return (
                  <FormModal title="Cập nhật trạng thái đơn hàng" index={index}>
                    <ChangeOrderStatusForm
                      orderId={item.props.orderId}
                      currentStatus={item.props.currentStatus}
                    />
                  </FormModal>
                );
              case "userOrders":
                return (
                  <FormModal title="Đơn hàng người dùng" index={index}>
                    <AdminUserOrders user={item.props.user} />
                  </FormModal>
                );
              case "createCollection":
                return (
                  <FormModal title="Tạo bộ sưu tập" index={index}>
                    <CreateCollectionForm {...item.props} />
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
