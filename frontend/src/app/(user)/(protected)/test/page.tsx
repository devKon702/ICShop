"use client";
import { useModalActions } from "@/store/modal-store";
import React from "react";

export default function TestPage() {
  const { openModal } = useModalActions();
  openModal({
    type: "prompt",
    props: {
      title: "Test Prompt",
      onSubmit: (value: string) => {
        console.log("Prompt submitted with value:", value);
      },
    },
  });

  openModal({
    type: "prompt",
    props: {
      title: "Test ",
      onSubmit: (value: string) => {
        console.log("Prompt submitted with value:", value);
      },
    },
  });

  return <div></div>;
}
