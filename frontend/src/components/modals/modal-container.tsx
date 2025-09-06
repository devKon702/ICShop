"use client";
import CreateAttributeForm from "@/components/forms/attribute/create-attribute-form";
import CreateValueForm from "@/components/forms/attribute/create-value-form";
import CreateCategoryForm from "@/components/forms/category/create-category-form";
import CreateProductForm from "@/components/forms/product/create-product-form";
import AlertModal from "@/components/modals/alert-modal";
import FormModal from "@/components/modals/form-modal";
import { useModal } from "@/store/modal-store";

export default function ModalContainer() {
  const modal = useModal();
  switch (modal?.type) {
    case "alert":
      return <AlertModal {...modal.props} />;
    case "createCategory":
      return (
        <FormModal title="Tạo danh mục">
          <CreateCategoryForm {...modal.props} />
        </FormModal>
      );
    case "createAttribute":
      return (
        <FormModal title="Thêm thông số">
          <CreateAttributeForm {...modal.props} />
        </FormModal>
      );
    case "createValue":
      return (
        <FormModal title="Thêm giá trị thông số">
          <CreateValueForm {...modal.props} />
        </FormModal>
      );
    case "createProduct":
      return (
        <FormModal title="Tạo Sản Phẩm">
          <CreateProductForm {...modal.props} />
        </FormModal>
      );
  }
}
