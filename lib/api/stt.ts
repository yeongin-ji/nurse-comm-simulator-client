const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export type SttResponse = {
  text: string;
};

/** Blob의 mime 타입에서 업로드 파일 확장자를 고른다. */
function fileExt(mime: string): string {
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

/**
 * POST /stt — 녹음된 음성(Blob)을 텍스트로 변환한다.
 * multipart 업로드라 JSON 기반 `api` 클라이언트와 분리했다 (tts.ts와 동일한 패턴).
 * 서버는 GCP Speech-to-Text V2 `chirp_3` 모델로 인식한다.
 */
export async function fetchStt(
  audio: Blob,
  language = "ko-KR"
): Promise<string> {
  const form = new FormData();
  form.append("audio", audio, `speech.${fileExt(audio.type)}`);
  form.append("language", language);

  const res = await fetch(`${BASE_URL}/stt`, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`STT request failed: ${res.status}`);
  }

  const data = (await res.json()) as SttResponse;
  return (data.text ?? "").trim();
}
