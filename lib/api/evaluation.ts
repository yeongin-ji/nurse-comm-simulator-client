import { api } from "./client";
import type { components } from "@/types/api";

export type EvaluationResponse =
  components["schemas"]["handler.EvaluationResultResponse"];

export const evaluationApi = {
  run: (sessionId: number) =>
    api.post<EvaluationResponse>(`/sessions/${sessionId}/evaluate`),
  get: (sessionId: number) =>
    api.get<EvaluationResponse>(`/sessions/${sessionId}/evaluation`),
};

export const evaluationKeys = {
  all: ["evaluation"] as const,
  detail: (sessionId: number) =>
    [...evaluationKeys.all, "detail", sessionId] as const,
};

export type EvaluationItem = { label: string; value: number };

export type ProjectedEvaluation = {
  totalScore: number;
  toolName: string;
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
  tool_name?: string;
};

/**
 * EvaluationResultResponse.item_scores is typed as unknown in the swagger,
 * so we narrow it here for UI rendering.
 */
export function projectEvaluation(
  res: EvaluationResponse | undefined
): ProjectedEvaluation | null {
  if (!res) return null;
  const raw = (res.item_scores as RawScores | null) ?? {};
  const items = Array.isArray(raw.items) ? raw.items : [];
  return {
    totalScore: raw.total ?? 0,
    toolName: raw.tool_name ?? "—",
    durationSeconds: raw.duration_seconds ?? 0,
    turns: raw.turns ?? 0,
    items,
    debriefing: res.debriefing_content ?? "",
  };
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${String(s).padStart(2, "0")}초`;
}
