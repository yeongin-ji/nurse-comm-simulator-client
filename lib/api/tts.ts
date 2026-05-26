import type { components } from "@/types/api";

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
