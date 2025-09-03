"use client";
import { useModalActions } from "@/store/modal-store";
import React from "react";

export default function TestPage() {
  const { openModal, closeModal } = useModalActions();
  openModal({
    type: "alert",
    props: {
      title: "Test alert",
      message: "Đây là thông báo từ test page",
      onClose: () => closeModal(),
    },
  });
  return <div></div>;
}
