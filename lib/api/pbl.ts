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

/** Best-effort extraction of the human-readable summary text from PBLSummaryResponse.categories (typed unknown). */
export function extractSummaryText(summary: PblSummaryResponse | undefined) {
  if (!summary?.categories) return "";
  const c = summary.categories;
  if (typeof c === "string") return c;
  if (typeof c === "object" && c !== null && "text" in c) {
    const text = (c as { text?: unknown }).text;
    if (typeof text === "string") return text;
  }
  return "";
}
