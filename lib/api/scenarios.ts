import { api } from "./client";
import type { components } from "@/types/api";

export type ScenarioResponse = components["schemas"]["handler.ScenarioResponse"];
export type ScenarioCreateResponse =
  components["schemas"]["handler.ScenarioCreateResponse"];
export type CreateScenarioRequest =
  components["schemas"]["handler.createScenarioRequest"];

export const scenariosApi = {
  detail: (id: number) => api.get<ScenarioResponse>(`/scenarios/${id}`),
  create: (body: CreateScenarioRequest) =>
    api.post<ScenarioCreateResponse>("/scenarios", body),
};

export const scenarioKeys = {
  all: ["scenarios"] as const,
  detail: (id: number) => [...scenarioKeys.all, "detail", id] as const,
};
