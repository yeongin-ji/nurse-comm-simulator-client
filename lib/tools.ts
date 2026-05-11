import { api } from "./api/client";
import type { components } from "@/types/api";

export type EvaluationToolResponse =
  components["schemas"]["handler.EvaluationToolResponse"];

export type EvaluationTool = {
  id: number;
  name: string;
  description: string;
  items: string[];
  maxScore: number;
};

function projectTool(raw: EvaluationToolResponse): EvaluationTool {
  const schema = raw.scoring_schema as
    | { scale?: { score: number }[] }
    | undefined;
  const maxScore = schema?.scale
    ? Math.max(...schema.scale.map((s) => s.score))
    : 5;

  const items =
    (raw.evaluation_items as { item_name: string }[] | undefined)?.map(
      (i) => i.item_name,
    ) ?? [];

  return {
    id: raw.id ?? 0,
    name: raw.tool_name ?? "—",
    description: raw.tool_description ?? "",
    items,
    maxScore,
  };
}

export const toolsApi = {
  list: () =>
    api
      .get<EvaluationToolResponse[]>("/evaluation-tools")
      .then((raw) => raw.map(projectTool)),
};

export const toolKeys = {
  all: ["evaluation-tools"] as const,
};

export function getToolByIdFrom(
  tools: EvaluationTool[],
  id: number | undefined,
): EvaluationTool | undefined {
  if (id == null) return undefined;
  return tools.find((t) => t.id === id);
}

export function getToolNameFrom(tools: EvaluationTool[], id: number | undefined) {
  return getToolByIdFrom(tools, id)?.name ?? "—";
}

// ── Backwards-compatible helpers (use empty array when tools not yet loaded) ──

/** @deprecated Prefer passing tools explicitly via getToolByIdFrom */
let _cache: EvaluationTool[] = [];
export function setToolsCache(tools: EvaluationTool[]) {
  _cache = tools;
}
export function getCachedTools(): EvaluationTool[] {
  return _cache;
}
export function getToolById(id: number | undefined): EvaluationTool | undefined {
  return getToolByIdFrom(_cache, id);
}
export function getToolName(id: number | undefined) {
  return getToolByIdFrom(_cache, id)?.name ?? "—";
}
