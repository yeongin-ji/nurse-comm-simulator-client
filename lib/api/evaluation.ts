import { api } from "./client";
import type { components } from "@/types/api";
import { getToolById } from "@/lib/tools";

export type EvaluationResponse =
  components["schemas"]["handler.EvaluationResultResponse"];

export const evaluationApi = {
  /** Trigger evaluation for all tools at once. Server runs them in parallel. */
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

export type EvaluationItem = {
  label: string;
  /**
   * Raw score for the item. `null` means N/A (the item does not apply to this
   * scenario). `0` is a real score ("미수행" / not done) — distinct from N/A.
   */
  value: number | null;
  /** Maximum possible score for this tool (e.g. KCC=2, GITCS=4) */
  maxScore: number;
  /** Criteria description from the evaluation tool definition */
  criteria?: string;
  /** Per-item AI rationale from the server (`item_scores.items[].reason`) */
  reason?: string;
};

export type ProjectedEvaluation = {
  toolId: number;
  /** Sum of scored items (excluding N/A) */
  totalScore: number;
  /** Sum of maxScore for scored items (excluding N/A) */
  totalMaxScore: number;
  durationSeconds: number;
  turns: number;
  items: EvaluationItem[];
  debriefing: string;
};

type RawScores = {
  /** value is `null` for N/A items, an integer otherwise (0 = not done). */
  items?: { label: string; value: number | null; reason?: string | null }[];
  total?: number;
  duration_seconds?: number;
  turns?: number;
};

/** EvaluationResultResponse.item_scores is typed as unknown; narrow it. */
export function projectEvaluation(
  res: EvaluationResponse | undefined,
): ProjectedEvaluation | null {
  if (!res || res.tool_id == null) return null;
  const tool = getToolById(res.tool_id);
  const maxScore = tool?.maxScore ?? 5;

  const raw = (res.item_scores as RawScores | null) ?? {};
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: EvaluationItem[] = rawItems.map((item) => {
    const detail = tool?.itemDetails.find((d) => d.name === item.label);
    return {
      label: item.label,
      value: item.value,
      maxScore,
      criteria: detail?.criteria,
      reason: item.reason ?? undefined,
    };
  });

  // Exclude N/A (null) items from the aggregate; 0 is a real score and stays in.
  const scored = items.filter((i) => i.value !== null);
  const totalScore = scored.reduce((acc, i) => acc + (i.value ?? 0), 0);
  const totalMaxScore = scored.length * maxScore;

  return {
    toolId: res.tool_id,
    totalScore,
    totalMaxScore,
    durationSeconds: raw.duration_seconds ?? 0,
    turns: raw.turns ?? 0,
    items,
    debriefing: res.debriefing_content ?? "",
  };
}

export function projectEvaluations(
  res: EvaluationResponse[] | undefined,
): ProjectedEvaluation[] {
  if (!res) return [];
  return res
    .map(projectEvaluation)
    .filter((e): e is ProjectedEvaluation => e !== null);
}

export function findEvaluationForTool(
  res: EvaluationResponse[] | undefined,
  toolId: number,
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

/** Format a score as "n / max" string. */
export function formatScore(value: number, maxScore: number) {
  return `${value} / ${maxScore}`;
}

/** Returns the toolId of the highest-scoring tool by ratio, or null when empty. */
export function topScoringToolId(
  evaluations: ProjectedEvaluation[],
): number | null {
  if (evaluations.length === 0) return null;
  let best = evaluations[0];
  let bestRatio = best.totalMaxScore > 0 ? best.totalScore / best.totalMaxScore : 0;
  for (const e of evaluations) {
    const ratio = e.totalMaxScore > 0 ? e.totalScore / e.totalMaxScore : 0;
    if (ratio > bestRatio) {
      best = e;
      bestRatio = ratio;
    }
  }
  return best.toolId;
}

/**
 * Overall percentage across every evaluation tool, weighted by available points
 * (sum of scored points / sum of scorable points). Returns 0 when nothing is
 * scorable so the hero header always renders a number.
 */
export function overallScorePercent(
  evaluations: ProjectedEvaluation[],
): number {
  const totalScore = evaluations.reduce((acc, e) => acc + e.totalScore, 0);
  const totalMax = evaluations.reduce((acc, e) => acc + e.totalMaxScore, 0);
  return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
}
