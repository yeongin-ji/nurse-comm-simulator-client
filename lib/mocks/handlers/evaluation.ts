import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type EvaluationResponse =
  components["schemas"]["handler.EvaluationResultResponse"];

const evaluations = new Map<number, EvaluationResponse>();

const ITEMS = [
  { label: "환자 맞이 및 자기소개", value: 90 },
  { label: "개방형 질문 사용", value: 75 },
  { label: "경청 및 공감 표현", value: 82 },
  { label: "환자 감정 확인", value: 68 },
  { label: "정보 전달 명확성", value: 80 },
  { label: "환자 동의 및 자율성 존중", value: 70 },
];

const DEBRIEFING = `자기소개와 초기 접근은 매우 효과적이었어요. 환자의 신뢰를 빠르게 형성하는 데 성공했으며, 이후 대화에서 환자의 불안감이 유의미하게 낮아졌습니다.

다만 개방형 질문보다 폐쇄형 질문의 비율이 높았어요. 다음에는 "어떻게 느끼세요?"와 같은 개방형 질문을 의식적으로 활용해 보세요.`;

function buildEvaluation(sessionId: number): EvaluationResponse {
  const total = Math.round(
    ITEMS.reduce((acc, i) => acc + i.value, 0) / ITEMS.length
  );
  return {
    id: sessionId * 100,
    session_id: sessionId,
    tool_id: 1,
    item_scores: {
      items: ITEMS,
      total,
      duration_seconds: 402,
      turns: 14,
      tool_name: "Kalamazoo",
    },
    debriefing_content: DEBRIEFING,
    created_at: new Date().toISOString(),
  };
}

export const evaluationHandlers = [
  http.post("/api/v1/sessions/:id/evaluate", async ({ params }) => {
    const id = Number(params.id);
    if (evaluations.has(id)) {
      return HttpResponse.json(
        { error: "already evaluated" },
        { status: 400 }
      );
    }
    // AI evaluation typically takes a moment.
    await new Promise((r) => setTimeout(r, 1500));
    const result = buildEvaluation(id);
    evaluations.set(id, result);
    return HttpResponse.json(result, { status: 201 });
  }),

  http.get("/api/v1/sessions/:id/evaluation", ({ params }) => {
    const id = Number(params.id);
    const cached = evaluations.get(id) ?? buildEvaluation(id);
    return HttpResponse.json(cached);
  }),
];
