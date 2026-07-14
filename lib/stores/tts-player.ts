import { create } from "zustand";

/**
 * 앱 전체에서 TTS 오디오는 이 스토어가 관리하는 단일 <audio> 엘리먼트로만
 * 재생됩니다. 덕분에 새 재생이 시작되면 이전 재생이 자동으로 멈추고,
 * 타이핑·음성 입력·화면 이탈 등 어떤 시점에서도 stop()으로 끊을 수 있어요.
 */
type TtsPlayerState = {
  /** 현재 재생 중인 오디오의 object URL (없으면 null) */
  playingUrl: string | null;
  play: (url: string) => void;
  stop: () => void;
};

let audio: HTMLAudioElement | null = null;

export const useTtsPlayer = create<TtsPlayerState>()((set, get) => ({
  playingUrl: null,
  play: (url) => {
    if (typeof window === "undefined") return;
    if (!audio) {
      audio = new Audio();
      audio.addEventListener("ended", () => set({ playingUrl: null }));
    }
    audio.pause();
    audio.src = url;
    audio.currentTime = 0;
    set({ playingUrl: url });
    audio.play().catch(() => {
      // 자동재생 차단 등으로 실패 — 이미 다른 재생이 시작됐다면 건드리지 않는다.
      if (get().playingUrl === url) set({ playingUrl: null });
    });
  },
  stop: () => {
    audio?.pause();
    if (get().playingUrl !== null) set({ playingUrl: null });
  },
}));

/** 훅을 쓸 수 없는 콜백/유틸에서 쓰는 imperative 접근자 */
export const ttsPlayer = {
  play: (url: string) => useTtsPlayer.getState().play(url),
  stop: () => useTtsPlayer.getState().stop(),
};
