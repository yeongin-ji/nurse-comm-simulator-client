import { create } from "zustand";

/**
 * 앱 전체에서 TTS 오디오는 이 스토어가 관리하는 단일 <audio> 엘리먼트로만
 * 재생됩니다. 덕분에 새 재생이 시작되면 이전 재생이 자동으로 멈추고,
 * 타이핑·음성 입력·화면 이탈 등 어떤 시점에서도 stop()으로 끊을 수 있어요.
 *
 * 스트리밍 재생(/tts/stream, Web Audio)은 <audio>를 쓰지 않으므로,
 * beginStream()으로 중단 콜백을 등록해 같은 단일 재생 정책에 편입시킵니다.
 */
type TtsPlayerState = {
  /** 현재 재생 중인 오디오의 object URL (없으면 null) */
  playingUrl: string | null;
  /** 현재 진행 중인 스트리밍 재생 세션 id (없으면 null) */
  streamingId: string | null;
  play: (url: string) => void;
  stop: () => void;
  /** 스트리밍 재생 시작을 등록한다. 기존 재생(오디오·스트림)은 중단된다. */
  beginStream: (id: string, stop: () => void) => void;
  /** 스트리밍 재생이 자연 종료/실패로 끝났음을 알린다. */
  endStream: (id: string) => void;
};

let audio: HTMLAudioElement | null = null;
let streamStop: (() => void) | null = null;

/** 활성 스트림이 있으면 중단하고 상태를 정리한다. */
function stopActiveStream(set: (s: Partial<TtsPlayerState>) => void) {
  if (streamStop) {
    const stop = streamStop;
    streamStop = null;
    stop();
  }
  set({ streamingId: null });
}

export const useTtsPlayer = create<TtsPlayerState>()((set, get) => ({
  playingUrl: null,
  streamingId: null,
  play: (url) => {
    if (typeof window === "undefined") return;
    stopActiveStream(set);
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
    stopActiveStream(set);
    audio?.pause();
    if (get().playingUrl !== null) set({ playingUrl: null });
  },
  beginStream: (id, stop) => {
    if (typeof window === "undefined") return;
    stopActiveStream(set);
    audio?.pause();
    if (get().playingUrl !== null) set({ playingUrl: null });
    streamStop = stop;
    set({ streamingId: id });
  },
  endStream: (id) => {
    if (get().streamingId !== id) return;
    streamStop = null;
    set({ streamingId: null });
  },
}));

/** 훅을 쓸 수 없는 콜백/유틸에서 쓰는 imperative 접근자 */
export const ttsPlayer = {
  play: (url: string) => useTtsPlayer.getState().play(url),
  stop: () => useTtsPlayer.getState().stop(),
  beginStream: (id: string, stop: () => void) =>
    useTtsPlayer.getState().beginStream(id, stop),
  endStream: (id: string) => useTtsPlayer.getState().endStream(id),
};
