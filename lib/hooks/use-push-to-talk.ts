"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchStt } from "@/lib/api/stt";
import { ttsPlayer } from "@/lib/stores/tts-player";

export type PttStatus = "idle" | "ready" | "recording" | "transcribing";
export type PttErrorKind = "permission" | "stt" | "empty";

// 마이크 버튼을 이보다 짧게 눌렀다 떼면 녹음이 아니라 "음성 입력 끄기"로 해석한다.
const TAP_MS = 250;
// 이보다 짧은 녹음은 실수로 스친 것으로 보고 조용히 버린다.
const MIN_RECORD_MS = 600;
// GCP 동기 Recognize 한도(1분)에 맞춘 녹음 상한 — 도달 시 자동으로 변환한다.
const MAX_RECORD_MS = 60_000;

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t));
}

export type UsePushToTalkOptions = {
  /** true면 새 녹음을 막고, 진행 중인 녹음은 폐기한다 (환자 응답 대기, 시간 초과 등). */
  disabled?: boolean;
  onTranscript: (text: string) => void;
  onError?: (kind: PttErrorKind) => void;
};

/**
 * Push-to-talk 음성 입력.
 * - 활성화(toggle/pressStart) 시 마이크 권한을 요청하고 스트림을 열어둔다.
 * - 활성 상태에서 마이크 버튼 홀드 또는 Ctrl 키 홀드 동안 녹음하고,
 *   떼면 STT로 변환해 onTranscript로 넘긴다.
 * - Ctrl+다른 키 조합(단축키)이 감지되면 해당 녹음은 버린다.
 */
export function usePushToTalk({
  disabled,
  onTranscript,
  onError,
}: UsePushToTalkOptions) {
  const [status, setStatus] = useState<PttStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const statusRef = useRef<PttStatus>("idle");
  const disabledRef = useRef(disabled);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const cancelledRef = useRef(false);
  const startedAtRef = useRef(0);
  const pressAtRef = useRef(0);
  const ctrlHeldRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    disabledRef.current = disabled;
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
  });

  const setStatusSafe = useCallback((s: PttStatus) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const clearTimers = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  }, []);

  const enable = useCallback(async () => {
    if (statusRef.current !== "idle") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionDenied(false);
      setStatusSafe("ready");
    } catch {
      setPermissionDenied(true);
      onErrorRef.current?.("permission");
    }
  }, [setStatusSafe]);

  const disable = useCallback(() => {
    clearTimers();
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      cancelledRef.current = true;
      rec.stop();
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatusSafe("idle");
  }, [clearTimers, setStatusSafe]);

  const transcribe = useCallback(
    async (blob: Blob) => {
      setStatusSafe("transcribing");
      const settle = () =>
        setStatusSafe(streamRef.current ? "ready" : "idle");
      try {
        const text = await fetchStt(blob);
        settle();
        if (text) onTranscriptRef.current(text);
        else onErrorRef.current?.("empty");
      } catch {
        settle();
        onErrorRef.current?.("stt");
      }
    },
    [setStatusSafe]
  );

  const finishRecording = useCallback((cancel: boolean) => {
    const rec = recorderRef.current;
    if (!rec || statusRef.current !== "recording") return;
    const tooShort = Date.now() - startedAtRef.current < MIN_RECORD_MS;
    cancelledRef.current = cancel || tooShort;
    rec.stop();
  }, []);

  const startRecording = useCallback(() => {
    if (statusRef.current !== "ready" || disabledRef.current) return;
    const stream = streamRef.current;
    if (!stream) return;

    // 재생 중인 TTS가 녹음에 섞이지 않도록 멈춘다.
    ttsPlayer.stop();

    let recorder: MediaRecorder;
    try {
      const mimeType = pickMimeType();
      recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
    } catch {
      onErrorRef.current?.("stt");
      return;
    }

    const chunks: Blob[] = [];
    cancelledRef.current = false;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      clearTimers();
      if (recorderRef.current === recorder) recorderRef.current = null;
      if (cancelledRef.current) {
        // disable()이 먼저 스트림을 닫았다면 idle 그대로 둔다.
        if (streamRef.current) setStatusSafe("ready");
        return;
      }
      void transcribe(
        new Blob(chunks, { type: recorder.mimeType || "audio/webm" })
      );
    };

    recorderRef.current = recorder;
    recorder.start();
    startedAtRef.current = Date.now();
    setElapsed(0);
    setStatusSafe("recording");
    tickRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
    maxTimerRef.current = setTimeout(
      () => finishRecording(false),
      MAX_RECORD_MS
    );
  }, [clearTimers, finishRecording, setStatusSafe, transcribe]);

  /** 마이크 버튼 pointerdown — idle이면 활성화, ready면 녹음 시작. */
  const pressStart = useCallback(() => {
    if (disabledRef.current) return;
    if (statusRef.current === "idle") {
      void enable();
      return;
    }
    if (statusRef.current !== "ready") return;
    pressAtRef.current = Date.now();
    startRecording();
  }, [enable, startRecording]);

  /** 마이크 버튼 pointerup — 짧은 탭은 끄기, 홀드였다면 변환. */
  const pressEnd = useCallback(() => {
    if (pressAtRef.current === 0 || statusRef.current !== "recording") {
      pressAtRef.current = 0;
      return;
    }
    const held = Date.now() - pressAtRef.current;
    pressAtRef.current = 0;
    if (held < TAP_MS) {
      finishRecording(true);
      disable();
    } else {
      finishRecording(false);
    }
  }, [disable, finishRecording]);

  /** 제스처가 중단됐을 때(pointercancel) — 녹음만 조용히 버린다. */
  const pressCancel = useCallback(() => {
    pressAtRef.current = 0;
    finishRecording(true);
  }, [finishRecording]);

  /** 키보드 접근용 — 클릭으로 활성/비활성만 토글. */
  const toggle = useCallback(() => {
    if (statusRef.current === "idle") void enable();
    else if (statusRef.current === "ready") disable();
  }, [disable, enable]);

  // Ctrl 홀드 = push-to-talk. 다른 키와 조합되면 단축키로 보고 녹음을 버린다.
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Control") {
        if (e.repeat || ctrlHeldRef.current) return;
        if (statusRef.current !== "ready" || disabledRef.current) return;
        ctrlHeldRef.current = true;
        startRecording();
      } else if (ctrlHeldRef.current && statusRef.current === "recording") {
        ctrlHeldRef.current = false;
        finishRecording(true);
      }
    };
    const onKeyUp = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Control" || !ctrlHeldRef.current) return;
      ctrlHeldRef.current = false;
      finishRecording(false);
    };
    const onBlur = () => {
      ctrlHeldRef.current = false;
      pressAtRef.current = 0;
      finishRecording(true);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [finishRecording, startRecording]);

  // 입력이 비활성화되면(환자 응답 대기, 시간 초과 모달) 진행 중 녹음을 폐기한다.
  useEffect(() => {
    if (!disabled) return;
    ctrlHeldRef.current = false;
    pressAtRef.current = 0;
    finishRecording(true);
  }, [disabled, finishRecording]);

  // 언마운트 시 스트림/타이머 정리.
  useEffect(() => {
    return () => {
      clearTimers();
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        cancelledRef.current = true;
        rec.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [clearTimers]);

  return {
    status,
    elapsed,
    permissionDenied,
    toggle,
    pressStart,
    pressEnd,
    pressCancel,
  };
}
