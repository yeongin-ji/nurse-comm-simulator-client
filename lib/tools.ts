import { api } from "./api/client";
import type { components } from "@/types/api";

export type EvaluationToolResponse =
  components["schemas"]["handler.EvaluationToolResponse"];

export type EvaluationToolItem = {
  name: string;
  criteria?: string;
};

export type EvaluationTool = {
  id: number;
  name: string;
  description: string;
  items: string[];
  /** items with criteria info */
  itemDetails: EvaluationToolItem[];
  maxScore: number;
};

function projectTool(raw: EvaluationToolResponse): EvaluationTool {
  const schema = raw.scoring_schema as
    | { scale?: { score: number }[] }
    | undefined;
  const maxScore = schema?.scale
    ? Math.max(...schema.scale.map((s) => s.score))
    : 5;

  const rawItems =
    (raw.evaluation_items as { item_name: string; criteria?: string }[] | undefined) ?? [];
  const items = rawItems.map((i) => i.item_name);
  const itemDetails: EvaluationToolItem[] = rawItems.map((i) => ({
    name: i.item_name,
    criteria: i.criteria,
  }));

  return {
    id: raw.id ?? 0,
    name: raw.tool_name ?? "—",
    description: raw.tool_description ?? "",
    items,
    itemDetails,
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

// ── Display helpers (derive abbreviation / short copy from server fields) ──
// The server exposes a single `tool_name` ("Full Name (ABBR)") and a verbose
// `tool_description` ("…를 평가하는 Full Name (ABBR)"). Until the API provides
// dedicated short_name / short_description fields, we parse them on the client.

/** Trailing-parens abbreviation, e.g. "KCC-24". Falls back to the full name. */
export function toolShortName(
  tool: EvaluationTool | undefined,
  fallback = "—",
): string {
  if (!tool) return fallback;
  const m = tool.name.match(/\(([^)]+)\)\s*$/);
  return m ? m[1].trim() : tool.name;
}

/** Tool name without the trailing parenthesised abbreviation. */
export function toolFullName(tool: EvaluationTool | undefined): string {
  if (!tool) return "";
  return tool.name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/**
 * The expanded (usually English) proper name the abbreviation stands for.
 * Lives at the tail of the description ("…를 평가하는 <Proper Name> (ABBR)").
 * Falls back to the name-derived full name when the pattern is absent.
 */
export function toolExpandedName(tool: EvaluationTool | undefined): string {
  if (!tool) return "";
  const marker = "평가하는";
  const i = tool.description?.indexOf(marker) ?? -1;
  const tail =
    tool.description && i >= 0
      ? tool.description.slice(i + marker.length)
      : toolFullName(tool);
  return tail.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/** Condensed one-liner: "…를 평가하는 X" → "…를 평가해요". */
export function toolShortDescription(tool: EvaluationTool | undefined): string {
  if (!tool?.description) return "";
  const i = tool.description.indexOf("평가하는");
  return i >= 0 ? `${tool.description.slice(0, i)}평가해요` : tool.description;
}
