"use client";
import AlertModal from "@/components/modals/alert-modal";
import { useModal } from "@/store/modal-store";

export default function ModalContainer() {
  const modal = useModal();
  switch (modal?.type) {
    case "alert":
      return <AlertModal {...modal.props}></AlertModal>;
  }
}
