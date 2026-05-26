import type { components } from "@/types/api";

export type TtsRequest = components["schemas"]["handler.ttsRequest"];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

/**
 * POST /tts — returns audio/wav as a Blob.
 * Separate from the JSON-based `api` client because the response is binary.
 */
export async function fetchTts(body: TtsRequest): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/tts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`TTS request failed: ${res.status}`);
  }

  return res.blob();
}

/**
 * Play a Blob of audio (WAV) and return the object URL for replay.
 */
export function playAudioBlob(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play().catch(() => {});
  return url;
}

/**
 * Replay audio from an existing object URL.
 */
export function replayAudio(url: string) {
  const audio = new Audio(url);
  audio.play().catch(() => {});
}
