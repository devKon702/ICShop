"use client";
import ImageCropper from "@/components/common/image-cropper";
import CreateAttributeForm from "@/components/features/attribute/create-attribute-form";
import CreateValueForm from "@/components/features/attribute/create-value-form";
import CreateProductForm from "@/components/features/product/forms/create/create-product-form";
import AlertModal from "@/components/modals/alert-modal";
import FormModal from "@/components/modals/form-modal";
import { useModal } from "@/store/modal-store";
import CreateCategoryForm from "@/components/features/category/forms/create-category-form";

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
              default:
                return null;
            }
          })()}
        </div>
      ))}
    </>
  );
}
