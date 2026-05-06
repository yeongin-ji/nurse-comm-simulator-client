import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";
import { TOOLS } from "@/lib/tools";

type EvaluationResponse =
  components["schemas"]["handler.EvaluationResultResponse"];

// Session id → already-produced evaluations (one per tool). Once a tool is
// scored, re-running evaluate doesn't touch it (see policy in user request:
// "각 평가 도구에 대해선 한 번만 평가가 가능").
const evaluations = new Map<number, EvaluationResponse[]>();

const DEBRIEFING_BY_TOOL: Record<number, string> = {
  1: `자기소개와 초기 접근은 매우 효과적이었어요. 환자의 신뢰를 빠르게 형성했습니다.

다만 개방형 질문보다 폐쇄형 질문의 비율이 높았어요. 다음에는 "어떻게 느끼세요?"와 같은 개방형 질문을 의식적으로 활용해 보세요.`,
  2: `환자 중심성과 공감적 반응은 인상적이었어요. 환자의 정서 상태에 잘 맞춰 대화를 이어가셨습니다.

협력적 의사결정 단계에서 선택지를 더 명확히 제시하면 환자 자율성이 한층 강화될 거예요.`,
};

function buildItemScores(toolId: number, items: string[], maxScore: number) {
  // Deterministic per-tool/per-item score within the tool's scale.
  // 0 = N/A (해당 없음), 1..maxScore = actual score.
  return items.map((label, idx) => ({
    label,
    value: 1 + ((toolId * 3 + idx * 2) % maxScore), // 1..maxScore
  }));
}

function buildEvaluationsFor(sessionId: number): EvaluationResponse[] {
  return TOOLS.map((tool) => {
    const items = buildItemScores(tool.id, tool.items, tool.maxScore);
    return {
      id: sessionId * 1000 + tool.id,
      session_id: sessionId,
      tool_id: tool.id,
      item_scores: {
        items,
        duration_seconds: 402,
        turns: 14,
      },
      debriefing_content: DEBRIEFING_BY_TOOL[tool.id] ?? "",
      created_at: new Date().toISOString(),
    } satisfies EvaluationResponse;
  });
}

export const evaluationHandlers = [
  /**
   * POST /sessions/:id/evaluate — runs a single tool by tool_id.
   * Re-running on a tool that already has a result returns 400.
   */
  http.post("/api/v1/sessions/:id/evaluate", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { tool_id: number };
    const toolId = body.tool_id;

    const existing = evaluations.get(id) ?? [];
    if (existing.some((r) => r.tool_id === toolId)) {
      return HttpResponse.json(
        { error: "evaluation already completed for this tool" },
        { status: 400 },
      );
    }

    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) {
      return HttpResponse.json(
        { error: "evaluation tool not found" },
        { status: 404 },
      );
    }

    await new Promise((r) => setTimeout(r, 1500));

    const items = buildItemScores(tool.id, tool.items, tool.maxScore);
    const result: EvaluationResponse = {
      id: id * 1000 + tool.id,
      session_id: id,
      tool_id: tool.id,
      item_scores: { items, duration_seconds: 402, turns: 14 },
      debriefing_content: DEBRIEFING_BY_TOOL[tool.id] ?? "",
      created_at: new Date().toISOString(),
    };

    existing.push(result);
    evaluations.set(id, existing);
    return HttpResponse.json(result, { status: 201 });
  }),

  /**
   * GET /sessions/:id/evaluation — returns the array of per-tool evaluations.
   * Synthesizes mock results when nothing has been stored yet so existing
   * history routes don't need a fresh evaluate call to render.
   */
  http.get("/api/v1/sessions/:id/evaluation", ({ params }) => {
    const id = Number(params.id);
    const cached = evaluations.get(id) ?? buildEvaluationsFor(id);
    return HttpResponse.json(cached);
  }),
];
