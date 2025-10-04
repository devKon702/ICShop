import { CreateAttributeSchema } from "@/libs/schemas/attribute.schema";
import {
  CategoryBaseSchema,
  CreateCategoryType,
} from "@/libs/schemas/category.schema";
import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Modal<K extends string, P> = { type: K; props: P };

type ModalType =
  | Modal<"alert", { title?: string; message: string; onClose: () => void }>
  | Modal<
      "prompt",
      {
        title: string;
        onSubmit: (value: string) => void | Promise<void>;
        placeholder?: string;
        defaultValue?: string;
        maxLength?: number;
        submitText?: string;
      }
    >
  | Modal<"auth", { onLoginSuccess: () => void }>
  | Modal<
      "createCategory",
      { parentId?: number; onSuccess: (res: CreateCategoryType) => void }
    >
  | Modal<
      "createAttribute",
      {
        categoryId: number;
        onSuccess: (res: z.infer<typeof CreateAttributeSchema>) => void;
      }
    >
  | Modal<"createValue", { attributeId: number; onSuccess: () => void }>
  | Modal<
      "createProduct",
      {
        onSuccess: () => void;
        categories: z.infer<typeof CategoryBaseSchema>[];
      }
    >
  | Modal<
      "imageCropper",
      { file: File; onImageComplete: (file: File, previewUrl: string) => void }
    >
  | Modal<"createAddress", unknown>
  | Modal<
      "updateAddress",
      {
        address: {
          id: number;
          alias: string;
          receiverName: string;
          receiverPhone: string;
          provinceId: number;
          districtId: number;
          wardId: number;
          detail: string;
        };
        onSuccess?: () => void;
      }
    >;

interface modalState {
  modal: ModalType[];
  actions: {
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
  };
}

const useModalStore = create<modalState>()(
  devtools((set, get) => ({
    modal: [],
    actions: {
      openModal: (modal) => set({ modal: [...get().modal, modal] }),
      closeModal: () => set({ modal: [...get().modal.slice(0, -1)] }),
    },
  }))
);

export const useModal = () => useModalStore((state) => state.modal);
export const useModalActions = () => useModalStore((state) => state.actions);
