import type { components } from "@/types/api";
import {
  createPcmStreamPlayer,
  type PcmStreamPlayer,
} from "@/lib/audio/pcm-stream-player";

export type TtsRequest = components["schemas"]["handler.ttsRequest"];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

/** Normalize gender to "M"/"F" as the server expects. */
function normalizeGender(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.trim();
  if (v === "M" || v === "F") return v;
  if (v.startsWith("남")) return "M";
  if (v.startsWith("여")) return "F";
  if (v.toLowerCase() === "male") return "M";
  if (v.toLowerCase() === "female") return "F";
  return raw;
}

/**
 * POST /tts — returns audio/wav as a Blob.
 * Separate from the JSON-based `api` client because the response is binary.
 */
export type TtsStreamHandle = {
  /**
   * 스트림과 재생 스케줄링이 정상 완료되면 다시듣기용 WAV Blob으로 resolve.
   * 네트워크/서버 오류 시 reject. abort()로 중단한 경우 null로 resolve.
   */
  done: Promise<Blob | null>;
  /** 네트워크 수신과 재생을 즉시 중단한다. */
  abort: () => void;
};

/**
 * POST /tts/stream — 헤더 없는 raw PCM 청크를 받아 도착 즉시 재생한다.
 * 완료되면 누적 PCM으로 WAV Blob을 만들어 반환하므로 기존 다시듣기 UI에 그대로 쓸 수 있다.
 */
export function streamTts(
  body: TtsRequest,
  opts?: { onFirstChunk?: () => void }
): TtsStreamHandle {
  const payload = {
    ...body,
    patient_gender: normalizeGender(body.patient_gender),
  };
  const controller = new AbortController();
  let player: PcmStreamPlayer | null = null;
  let aborted = false;

  const done = (async (): Promise<Blob | null> => {
    const res = await fetch(`${BASE_URL}/tts/stream`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      throw new Error(`TTS stream request failed: ${res.status}`);
    }

    const sampleRate = Number(res.headers.get("X-Audio-Sample-Rate")) || 24000;
    player = createPcmStreamPlayer(sampleRate);
    const chunks: Uint8Array[] = [];
    const reader = res.body.getReader();
    let first = true;

    try {
      for (;;) {
        const { done: eof, value } = await reader.read();
        if (eof) break;
        if (!value || value.length === 0) continue;
        if (first) {
          first = false;
          opts?.onFirstChunk?.();
        }
        chunks.push(value);
        player.feed(value);
      }
    } catch (err) {
      player.stop();
      if (aborted) return null;
      throw err;
    }

    player.end();
    await player.finished;
    if (aborted) return null;
    return pcmToWavBlob(chunks, sampleRate);
  })();

  return {
    done,
    abort: () => {
      aborted = true;
      controller.abort();
      player?.stop();
    },
  };
}

/** 누적 PCM 청크에 44바이트 WAV 헤더를 씌워 재생 가능한 Blob을 만든다. */
function pcmToWavBlob(chunks: Uint8Array[], sampleRate: number): Blob {
  const dataSize = chunks.reduce((n, c) => n + c.length, 0);
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  const channels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, (channels * bitsPerSample) / 8, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  return new Blob([header, ...(chunks as BlobPart[])], { type: "audio/wav" });
}

export async function fetchTts(body: TtsRequest): Promise<Blob> {
  const payload = {
    ...body,
    patient_gender: normalizeGender(body.patient_gender),
  };

  const res = await fetch(`${BASE_URL}/tts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`TTS request failed: ${res.status}`);
  }

  return res.blob();
}
