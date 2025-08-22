// stores/useDialogStore.ts
import { create } from "zustand";

type DialogState = {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export const useSignInDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
