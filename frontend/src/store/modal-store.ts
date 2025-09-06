import { CreateAttributeSchema } from "@/libs/schemas/attribute.schema";
import {
  CategoryBaseSchema,
  CreateCategoryType,
} from "@/libs/schemas/category.schema";
import { z } from "zod";
import { create } from "zustand";

type Modal<K extends string, P> = { type: K; props: P };

type ModalType =
  | Modal<"alert", { title?: string; message: string; onClose: () => void }>
  | Modal<"auth", { onClose: () => void }>
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
    >;

interface modalState {
  modal: ModalType | null;
  actions: {
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
  };
}

const useModalStore = create<modalState>()((set) => ({
  modal: null,
  actions: {
    openModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null }),
  },
}));

export const useModal = () => useModalStore((state) => state.modal);
export const useModalActions = () => useModalStore((state) => state.actions);
