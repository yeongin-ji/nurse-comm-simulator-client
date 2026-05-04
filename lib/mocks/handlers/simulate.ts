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

export const simulateHandlers = [
  http.post("/api/v1/sessions/:id/simulate", async ({ params, request }) => {
    const id = Number(params.id);
    await request.json();
    await new Promise((r) => setTimeout(r, 900));

    const current = states.get(id) ?? DEFAULT_STATE;
    const next = decay(current);
    states.set(id, next);

    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    const payload: SimulateResponse = { reply, current_state: next };
    return HttpResponse.json(payload);
  }),
];
