import { api } from "./client";
import type { components } from "@/types/api";

export type PblTurnRequest = components["schemas"]["handler.pblTurnRequest"];
export type PblTurnResponse =
  components["schemas"]["handler.PBLTurnResponse"];
export type PblSummaryResponse =
  components["schemas"]["handler.PBLSummaryResponse"];

export const pblApi = {
  sendTurn: (sessionId: number, body: PblTurnRequest) =>
    api.post<PblTurnResponse>(`/sessions/${sessionId}/pbl`, body),
  generateSummary: (sessionId: number) =>
    api.post<PblSummaryResponse>(`/sessions/${sessionId}/pbl/summary`),
  getSummary: (sessionId: number) =>
    api.get<PblSummaryResponse>(`/sessions/${sessionId}/pbl/summary`),
};

export const pblKeys = {
  all: ["pbl"] as const,
  summary: (sessionId: number) =>
    [...pblKeys.all, "summary", sessionId] as const,
};

export type PblSummaryCategory = {
  name: string;
  items: string[];
};

/** Parse PBLSummaryResponse.categories (typed unknown) into a typed array. */
export function projectCategories(
  summary: PblSummaryResponse | undefined,
): PblSummaryCategory[] {
  if (!summary?.categories) return [];
  const raw = summary.categories;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (c): c is PblSummaryCategory =>
      typeof c === "object" &&
      c !== null &&
      typeof c.name === "string" &&
      Array.isArray(c.items),
  );
}
