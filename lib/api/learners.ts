import { api } from "./client";
import type { components } from "@/types/api";

export type LearnerResponse = components["schemas"]["handler.LearnerResponse"];
export type CreateLearnerRequest =
  components["schemas"]["handler.createLearnerRequest"];

export const learnersApi = {
  detail: (id: number) => api.get<LearnerResponse>(`/learners/${id}`),
  create: (body: CreateLearnerRequest) =>
    api.post<LearnerResponse>("/learners", body),
};

export const learnerKeys = {
  all: ["learners"] as const,
  detail: (id: number) => [...learnerKeys.all, "detail", id] as const,
};
