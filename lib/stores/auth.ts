import { create } from "zustand";

export type Role = "learner" | "educator";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  studentNumber?: string;
};

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  reset: () => set({ user: null }),
}));
