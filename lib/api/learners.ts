import { api } from "./client";
import type { components } from "@/types/api";

export type LearnerResponse = components["schemas"]["handler.LearnerResponse"];
export type CreateLearnerRequest =
  components["schemas"]["handler.createLearnerRequest"];

// Backend extension fields (see README "API 보완 필요"). Mock provides these;
// real backend should add them to LearnerResponse when endpoint is specified.
export type LearnerWithStats = LearnerResponse & {
  session_count?: number;
  last_session_at?: string | null;
  average_score?: number | null;
};

export type LearnerSession = {
  id: number;
  learner_id: number;
  scenario_id: number;
  disease: string;
  start_time: string;
  session_status: string;
  total_score: number | null;
  comment_count: number;
};

export const learnersApi = {
  list: () => api.get<LearnerWithStats[]>("/learners"),
  detail: (id: number) => api.get<LearnerResponse>(`/learners/${id}`),
  create: (body: CreateLearnerRequest) =>
    api.post<LearnerResponse>("/learners", body),
  listSessions: (id: number) =>
    api.get<LearnerSession[]>(`/learners/${id}/sessions`),
};

export const learnerKeys = {
  all: ["learners"] as const,
  list: () => [...learnerKeys.all, "list"] as const,
  detail: (id: number) => [...learnerKeys.all, "detail", id] as const,
  sessions: (id: number) =>
    [...learnerKeys.all, "sessions", id] as const,
};

export function formatSessionDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${mo}.${da} ${h}:${mi}`;
}
