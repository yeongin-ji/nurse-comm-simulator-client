/**
 * Evaluation tools registered for the simulation. A session is evaluated
 * against every tool here once the dialogue ends; each tool produces an
 * independent EvaluationResultResponse keyed by `tool_id`.
 *
 * This list is the single source of truth on the client. Backend additions
 * should mirror this constant (or expose `GET /tools` if the registry needs
 * to be remote later).
 */
export type EvaluationTool = {
  id: number;
  name: string;
  description: string;
  /** Display labels for each item the tool scores. Order matters. */
  items: string[];
};

export const TOOLS: EvaluationTool[] = [
  {
    id: 1,
    name: "Kalamazoo",
    description: "환자 중심 의사소통의 핵심 영역을 평가해요.",
    items: [
      "환자 맞이 및 자기소개",
      "개방형 질문 사용",
      "경청 및 공감 표현",
      "환자 감정 확인",
      "정보 전달 명확성",
      "환자 동의 및 자율성 존중",
    ],
  },
  {
    id: 2,
    name: "GITCS",
    description: "포괄적 임상 의사소통 기술 평가.",
    items: [
      "환자 중심성",
      "정보 공유의 명확성",
      "상호 존중과 신뢰",
      "협력적 의사결정",
      "공감적 반응",
    ],
  },
];

export function getToolById(id: number | undefined): EvaluationTool | undefined {
  if (id == null) return undefined;
  return TOOLS.find((t) => t.id === id);
}

export function getToolName(id: number | undefined) {
  return getToolById(id)?.name ?? "—";
}
