import { create } from "zustand";

export type ToastVariant = "default" | "success" | "danger";

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastState = {
  items: ToastItem[];
  show: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
};

let seq = 0;

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  show: (message, variant = "default") => {
    const id = `toast-${++seq}`;
    set((s) => ({ items: [...s.items, { id, message, variant }] }));
    setTimeout(() => {
      set((s) => ({ items: s.items.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismiss: (id) => {
    set((s) => ({ items: s.items.filter((t) => t.id !== id) }));
  },
}));

/** Convenience hook — returns just the `show` function. */
export function useToast() {
  return useToastStore((s) => s.show);
}
