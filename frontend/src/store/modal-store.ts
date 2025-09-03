import { create } from "zustand";

type ModalType =
  | {
      type: "alert";
      props: { title?: string; message: string; onClose: () => void };
    }
  | { type: "auth"; props: { onClose: () => void } };

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
