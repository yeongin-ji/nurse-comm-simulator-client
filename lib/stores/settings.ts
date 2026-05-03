import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  ttsEnabled: boolean;
  profileImageEnabled: boolean;
  setTtsEnabled: (v: boolean) => void;
  setProfileImageEnabled: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ttsEnabled: true,
      profileImageEnabled: false,
      setTtsEnabled: (v) => set({ ttsEnabled: v }),
      setProfileImageEnabled: (v) => set({ profileImageEnabled: v }),
    }),
    {
      name: "nursecomm-settings",
      version: 1,
    }
  )
);
