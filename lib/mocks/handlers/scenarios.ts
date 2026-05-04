import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type CreateRequest = components["schemas"]["handler.createScenarioRequest"];
type CreateResponse = components["schemas"]["handler.ScenarioCreateResponse"];

let nextId = 1001;

export const scenarioHandlers = [
  http.post("/api/v1/scenarios", async ({ request }) => {
    const body = (await request.json()) as CreateRequest;

    // Mock latency to surface loading UI (10–20s in real flow; keep snappy here)
    await new Promise((r) => setTimeout(r, 600));

    const id = nextId++;
    const payload: CreateResponse = {
      scenario: {
        id,
        document_id: body.document_id,
        learner_id: body.learner_id,
        scenario_text:
          "환자는 호흡곤란을 호소하며 교육을 거부합니다. 신뢰 형성 후 단계적으로 호흡 교육을 시도해 주세요. (mock)",
        dilemma: { summary: "교육 거부 환자 (mock)" },
        medical_record: { age: 47, sex: "M" },
        created_at: new Date().toISOString(),
      },
      initial_state: {
        심리적_상태: { anxiety: 70, anger: 50, depression: 20 },
        환경적_상태: { vital_signs: "혈압 138/88, 맥박 102" },
      },
    };
    return HttpResponse.json(payload, { status: 201 });
  }),

  http.get("/api/v1/scenarios/:id", ({ params }) => {
    const id = Number(params.id);
    // Map known list IDs to documents so listing → detail stays consistent.
    const SCENARIO_DOC_MAP: Record<number, number> = {
      100: 2, // COPD
      101: 4, // 폐렴
      102: 5, // 심부전
    };
    const docId = SCENARIO_DOC_MAP[id] ?? 2;
    return HttpResponse.json({
      id,
      document_id: docId,
      learner_id: 1,
      scenario_text:
        '환자는 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡과 복식 호흡을 교육하려 합니다. 하지만 환자는 "숨차 죽겠는데 자꾸 뭘 시키냐"며 교육을 완강히 거부합니다. (mock)',
      dilemma: { summary: "교육 거부 환자 (mock)" },
      medical_record: { name: "OOO", age: 47, sex: "M", difficulty: "중" },
      created_at: "2026-04-01T00:00:00Z",
    });
  }),
];
