import { api } from "./client";
import type { components } from "@/types/api";

export type EvaluationResponse =
  components["schemas"]["handler.EvaluationResultResponse"];

export const evaluationApi = {
  /** Run every registered tool once. Returns the new array of per-tool results. */
  run: (sessionId: number) =>
    api.post<EvaluationResponse[]>(`/sessions/${sessionId}/evaluate`),
  /** List all per-tool evaluations stored for the session. */
  list: (sessionId: number) =>
    api.get<EvaluationResponse[]>(`/sessions/${sessionId}/evaluation`),
};

export const evaluationKeys = {
  all: ["evaluation"] as const,
  list: (sessionId: number) =>
    [...evaluationKeys.all, "list", sessionId] as const,
};

export type EvaluationItem = { label: string; value: number };

export type ProjectedEvaluation = {
  toolId: number;
  totalScore: number;
  durationSeconds: number;
  turns: number;
  items: EvaluationItem[];
  debriefing: string;
};

type RawScores = {
  items?: EvaluationItem[];
  total?: number;
  duration_seconds?: number;
  turns?: number;
};

/** EvaluationResultResponse.item_scores is typed as unknown; narrow it. */
export function projectEvaluation(
  res: EvaluationResponse | undefined
): ProjectedEvaluation | null {
  if (!res || res.tool_id == null) return null;
  const raw = (res.item_scores as RawScores | null) ?? {};
  const items = Array.isArray(raw.items) ? raw.items : [];
  return {
    toolId: res.tool_id,
    totalScore: raw.total ?? 0,
    durationSeconds: raw.duration_seconds ?? 0,
    turns: raw.turns ?? 0,
    items,
    debriefing: res.debriefing_content ?? "",
  };
}

export function projectEvaluations(
  res: EvaluationResponse[] | undefined
): ProjectedEvaluation[] {
  if (!res) return [];
  return res
    .map(projectEvaluation)
    .filter((e): e is ProjectedEvaluation => e !== null);
}

export function findEvaluationForTool(
  res: EvaluationResponse[] | undefined,
  toolId: number
): ProjectedEvaluation | null {
  if (!res) return null;
  const match = res.find((r) => r.tool_id === toolId);
  return projectEvaluation(match);
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${String(s).padStart(2, "0")}초`;
}

export function averageScore(evaluations: ProjectedEvaluation[]): number {
  if (evaluations.length === 0) return 0;
  const sum = evaluations.reduce((acc, e) => acc + e.totalScore, 0);
  return Math.round(sum / evaluations.length);
}

/** Returns the toolId of the highest-scoring tool, or null when empty/tied at zero. */
export function topScoringToolId(
  evaluations: ProjectedEvaluation[]
): number | null {
  if (evaluations.length === 0) return null;
  let best = evaluations[0];
  for (const e of evaluations) {
    if (e.totalScore > best.totalScore) best = e;
  }
  return best.toolId;
}
