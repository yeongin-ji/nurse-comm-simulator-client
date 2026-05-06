import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type TurnResponse = components["schemas"]["handler.PBLTurnResponse"];
type SummaryResponse = components["schemas"]["handler.PBLSummaryResponse"];

const SUMMARY_CATEGORIES = [
  {
    name: "신체적 안정 확보",
    items: [
      "산소 포화도를 지속적으로 모니터링하고, 반좌위를 유지하도록 도와요",
      "활력징후(혈압, 맥박, 호흡, 체온)를 주기적으로 측정해요",
    ],
  },
  {
    name: "심리적 안정 및 신뢰 형성",
    items: [
      "공감적 경청과 안심 제공을 통해 심리적 안정을 도모해요",
      "환자의 감정을 인정하고, 신뢰 관계를 먼저 형성해요",
    ],
  },
  {
    name: "교육적 중재",
    items: [
      "환자가 안정된 이후에 흡입기 사용법을 교육해요",
      "증상 악화 시 대처법에 대해 단계적으로 안내해요",
    ],
  },
];

function buildSummary(sessionId: number): SummaryResponse {
  return {
    id: sessionId * 10,
    session_id: sessionId,
    categories: SUMMARY_CATEGORIES,
    created_at: new Date().toISOString(),
  };
}

const summaries = new Map<number, SummaryResponse>();

const REPLIES = [
  "좋은 접근이에요. 환자의 감정을 먼저 공감한 뒤 교육을 시도하면 거부감이 줄어들 수 있어요.",
  "신뢰가 형성된 후에 호흡 교육을 단계적으로 안내하는 흐름이 좋겠어요.",
  "맞아요. 자율성을 존중하는 자세가 환자의 협조를 이끌어 낼 거예요.",
  "지금 정리한 흐름이라면 실제 대화에서도 무리 없이 이어갈 수 있을 거예요.",
  "마지막으로 자기 자신의 마음가짐도 한번 점검해 보세요. 곧 환자를 만나러 갈 시간이에요.",
];

export const pblHandlers = [
  http.post("/api/v1/sessions/:id/pbl", async ({ request }) => {
    await request.json();
    await new Promise((r) => setTimeout(r, 800));
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    const payload: TurnResponse = { reply };
    return HttpResponse.json(payload);
  }),

  http.post("/api/v1/sessions/:id/pbl/summary", async ({ params }) => {
    const id = Number(params.id);
    await new Promise((r) => setTimeout(r, 1100));
    const summary = buildSummary(id);
    summaries.set(id, summary);
    return HttpResponse.json(summary);
  }),

  http.get("/api/v1/sessions/:id/pbl/summary", ({ params }) => {
    const id = Number(params.id);
    const cached = summaries.get(id) ?? buildSummary(id);
    return HttpResponse.json(cached);
  }),
];
