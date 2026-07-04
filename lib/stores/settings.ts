import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  ttsEnabled: boolean;
  profileImageEnabled: boolean;
  /** 음성 입력(STT) 변환 결과를 확인 없이 바로 전송할지 여부 */
  sttAutoSend: boolean;
  setTtsEnabled: (v: boolean) => void;
  setProfileImageEnabled: (v: boolean) => void;
  setSttAutoSend: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ttsEnabled: true,
      profileImageEnabled: false,
      sttAutoSend: true,
      setTtsEnabled: (v) => set({ ttsEnabled: v }),
      setProfileImageEnabled: (v) => set({ profileImageEnabled: v }),
      setSttAutoSend: (v) => set({ sttAutoSend: v }),
    }),
    {
      name: "nursecomm-settings",
      version: 1,
    }
  )
);
