import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type SimulateResponse = components["schemas"]["handler.SimulateTurnResponse"];

export type MockPatientState = {
  vital_signs: {
    blood_pressure: string;
    pulse: string;
    respiration: string;
    temperature: string;
  };
  psychological: {
    anxiety: number;
    anger: number;
    depression: number;
  };
};

const REPLIES = [
  "(천천히 숨을 고르며) ...조금 안정이 되는 것 같아요.",
  "(고개를 끄덕이며) 그렇게 말씀해 주시니 마음이 좀 놓이네요.",
  "(잠시 망설이다가) ...어떻게 하면 되는데요?",
  "(살짝 미소 지으며) 처음엔 무서웠는데 지금은 괜찮아요.",
  "(눈을 마주치며) 그동안 너무 답답했어요. 들어주셔서 감사해요.",
  "(시도해 보며) 아, 이렇게 하면 숨이 좀 편해지네요.",
];

const DEFAULT_STATE: MockPatientState = {
  vital_signs: {
    blood_pressure: "138/88",
    pulse: "102 bpm",
    respiration: "24회/분",
    temperature: "37.2℃",
  },
  psychological: {
    anxiety: 72,
    anger: 55,
    depression: 20,
  },
};

const states = new Map<number, MockPatientState>();

function decay(prev: MockPatientState): MockPatientState {
  return {
    vital_signs: {
      ...prev.vital_signs,
      // Pulse and respiration ease toward calmer ranges as the dialogue progresses.
      pulse: `${Math.max(78, parseInt(prev.vital_signs.pulse, 10) - 3)} bpm`,
      respiration: `${Math.max(16, parseInt(prev.vital_signs.respiration, 10) - 1)}회/분`,
    },
    psychological: {
      anxiety: Math.max(0, prev.psychological.anxiety - 6),
      anger: Math.max(0, prev.psychological.anger - 4),
      depression: Math.max(0, prev.psychological.depression - 1),
    },
  };
}

// Minimal WAV header (44 bytes) + 0.5s of silence at 16kHz mono 16-bit
function emptyWav(): ArrayBuffer {
  const sampleRate = 16000;
  const duration = 0.5;
  const numSamples = sampleRate * duration;
  const dataSize = numSamples * 2; // 16-bit = 2 bytes
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  // RIFF header
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  // data bytes are zero-initialized (silence)
  return buffer;
}

export const simulateHandlers = [
  // TTS mock: return a short silent WAV
  http.post("/api/v1/tts", async () => {
    await new Promise((r) => setTimeout(r, 200));
    return new HttpResponse(emptyWav(), {
      headers: { "Content-Type": "audio/wav" },
    });
  }),

  // TTS streaming mock: 무음 raw PCM(24kHz mono 16-bit)을 청크 3개로 나눠 전송
  http.post("/api/v1/tts/stream", async () => {
    const chunk = new Uint8Array(24000 * 2 * 0.3); // 0.3초 무음
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for (let i = 0; i < 3; i++) {
          await new Promise((r) => setTimeout(r, 150));
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });
    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Audio-Sample-Rate": "24000",
        "X-Audio-Channels": "1",
        "X-Audio-Bits": "16",
      },
    });
  }),

  http.post("/api/v1/sessions/:id/simulate", async ({ params, request }) => {
    const id = Number(params.id);
    await request.json();
    await new Promise((r) => setTimeout(r, 900));

    const current = states.get(id) ?? DEFAULT_STATE;
    const next = decay(current);
    states.set(id, next);

    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    const payload: SimulateResponse = {
      reply,
      speech_direction: "차분하고 부드러운 톤으로, 살짝 안도하는 듯한 감정을 담아 말한다.",
      current_state: next,
    };
    return HttpResponse.json(payload);
  }),
];
