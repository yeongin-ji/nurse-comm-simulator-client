import { api } from "./client";
import type { components } from "@/types/api";

export type SessionResponse = components["schemas"]["handler.SessionResponse"];
export type CreateSessionRequest =
  components["schemas"]["handler.createSessionRequest"];
export type AdvancePhaseRequest =
  components["schemas"]["handler.advancePhaseRequest"];

export const sessionsApi = {
  detail: (id: number) => api.get<SessionResponse>(`/sessions/${id}`),
  create: (body: CreateSessionRequest) =>
    api.post<SessionResponse>("/sessions", body),
  advancePhase: (id: number, body: AdvancePhaseRequest) =>
    api.post<SessionResponse>(`/sessions/${id}/phase`, body),
};

export const sessionKeys = {
  all: ["sessions"] as const,
  detail: (id: number) => [...sessionKeys.all, "detail", id] as const,
};
