import { create } from "zustand";

interface ModalState {
  openModals: Set<string>;
  isOpen: (modalId: string) => boolean;
  open: (modalId: string) => void;
  close: (modalId: string) => void;
  toggle: (modalId: string) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  openModals: new Set(),

  isOpen: (modalId: string) => get().openModals.has(modalId),

  open: (modalId: string) =>
    set((state) => ({
      openModals: new Set(state.openModals).add(modalId),
    })),

  close: (modalId: string) =>
    set((state) => {
      const newSet = new Set(state.openModals);
      newSet.delete(modalId);
      return { openModals: newSet };
    }),

  toggle: (modalId: string) =>
    set((state) => {
      const newSet = new Set(state.openModals);
      if (newSet.has(modalId)) {
        newSet.delete(modalId);
      } else {
        newSet.add(modalId);
      }
      return { openModals: newSet };
    }),

  closeAll: () => set({ openModals: new Set() }),
}));
