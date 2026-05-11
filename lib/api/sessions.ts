import { api } from "./client";
import type { components } from "@/types/api";

export type SessionResponse = components["schemas"]["handler.SessionResponse"];
export type CreateSessionRequest =
  components["schemas"]["handler.createSessionRequest"];
export type AdvancePhaseRequest =
  components["schemas"]["handler.advancePhaseRequest"];
export type SessionMessagesResponse =
  components["schemas"]["handler.SessionMessagesResponse"];
export type SessionMessage =
  components["schemas"]["handler.SessionMessage"];

export const sessionsApi = {
  detail: (id: number) => api.get<SessionResponse>(`/sessions/${id}`),
  create: (body: CreateSessionRequest) =>
    api.post<SessionResponse>("/sessions", body),
  advancePhase: (id: number, body: AdvancePhaseRequest) =>
    api.post<SessionResponse>(`/sessions/${id}/phase`, body),
  messages: (id: number) =>
    api.get<SessionMessagesResponse>(`/sessions/${id}/messages`),
};

export const sessionKeys = {
  all: ["sessions"] as const,
  detail: (id: number) => [...sessionKeys.all, "detail", id] as const,
  messages: (id: number) => [...sessionKeys.all, "messages", id] as const,
};
