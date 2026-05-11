import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type CreateRequest = components["schemas"]["handler.createSessionRequest"];
type SessionResponse = components["schemas"]["handler.SessionResponse"];
type AdvanceRequest = components["schemas"]["handler.advancePhaseRequest"];

const sessions = new Map<number, SessionResponse>();
let nextId = 5001;

function makeSession(scenarioId: number, learnerId: number): SessionResponse {
  const id = nextId++;
  const session: SessionResponse = {
    id,
    scenario_id: scenarioId,
    learner_id: learnerId,
    current_phase: "PBL",
    session_status: "ACTIVE",
    evaluation_status: "PENDING",
    simulation_duration_seconds: 0,
    start_time: new Date().toISOString(),
  };
  sessions.set(id, session);
  return session;
}

export const sessionHandlers = [
  http.post("/api/v1/sessions", async ({ request }) => {
    const body = (await request.json()) as CreateRequest;
    await new Promise((r) => setTimeout(r, 250));
    const session = makeSession(body.scenario_id, body.learner_id);
    return HttpResponse.json(session, { status: 201 });
  }),

  http.get("/api/v1/sessions/:id", ({ params }) => {
    const id = Number(params.id);
    const session = sessions.get(id);
    if (!session) {
      // Synthesize for ad-hoc IDs (e.g. when the user navigates directly).
      return HttpResponse.json(makeSession(2, 1));
    }
    return HttpResponse.json(session);
  }),

  http.get("/api/v1/sessions/:id/messages", ({ params }) => {
    const id = Number(params.id);
    if (!sessions.has(id) && id < 1) {
      return HttpResponse.json({ error: "session not found" }, { status: 404 });
    }
    return HttpResponse.json({
      pbl: [
        { role: "ai-peer", content: "환자를 만나기 전에 의사소통 방향을 함께 논의해 봐요." },
        { role: "user", content: "환자의 불안을 줄이고 교육에 대한 거부감을 낮추고 싶어요." },
        { role: "ai-peer", content: "공감적 경청 후 단계적 교육 흐름이 좋겠어요." },
        { role: "user", content: "공감 → 신뢰 → 동의 → 교육 순서로 진행하겠습니다." },
      ],
      simulation: [
        { role: "patient", content: "(거칠게 숨을 몰아쉬며) 뭐가 필요해요?" },
        { role: "user", content: "안녕하세요, 저는 담당 간호학생이에요. 지금 많이 힘드시죠?" },
        { role: "patient", content: "...네, 숨쉬기가 너무 힘들어요." },
        { role: "user", content: "지금 가장 불편한 부분이 어디세요? 천천히 말씀해 주셔도 돼요." },
        { role: "patient", content: "가슴이 꽉 막힌 것 같고 자꾸 기침이 나와요." },
        { role: "user", content: "많이 답답하셨겠어요. 호흡을 편하게 하실 방법을 같이 해 보시겠어요?" },
      ],
    });
  }),

  http.post("/api/v1/sessions/:id/phase", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as AdvanceRequest;
    const session = sessions.get(id);
    if (!session) {
      return HttpResponse.json({ error: "session not found" }, { status: 404 });
    }
    const next = { ...session, current_phase: body.phase };
    sessions.set(id, next);
    return HttpResponse.json(next);
  }),
];
