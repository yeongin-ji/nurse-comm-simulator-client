import { api } from "./client";
import type { components } from "@/types/api";
import type {
  Psychological,
  VitalSign,
} from "@/components/sim/patient-state-panel";

export type ScenarioResponse = components["schemas"]["handler.ScenarioResponse"];
export type ScenarioListItem = components["schemas"]["handler.ScenarioListItem"];
export type ScenarioSessionResponse =
  components["schemas"]["handler.ScenarioSessionResponse"];
export type ScenarioCreateResponse =
  components["schemas"]["handler.ScenarioCreateResponse"];
export type CreateScenarioRequest =
  components["schemas"]["handler.createScenarioRequest"];

// Extension fields the scenario detail surfaces (objectives + initial state).
// Backend should expose these on GET /scenarios/{id}; mock provides them today.
export type ScenarioDetailResponse = ScenarioResponse & {
  objectives?: string[];
  initial_state?: unknown;
};

export const scenariosApi = {
  list: (learnerId?: number) =>
    api.get<ScenarioListItem[]>(
      learnerId ? `/scenarios?learner_id=${learnerId}` : "/scenarios",
    ),
  detail: (id: number) =>
    api.get<ScenarioDetailResponse>(`/scenarios/${id}`),
  create: (body: CreateScenarioRequest) =>
    api.post<ScenarioCreateResponse>("/scenarios", body),
  delete: (id: number) => api.delete<void>(`/scenarios/${id}`),
  sessions: (id: number) =>
    api.get<ScenarioSessionResponse[]>(`/scenarios/${id}/sessions`),
};

export const scenarioKeys = {
  all: ["scenarios"] as const,
  list: () => [...scenarioKeys.all, "list"] as const,
  detail: (id: number) => [...scenarioKeys.all, "detail", id] as const,
  sessions: (id: number) => [...scenarioKeys.all, "sessions", id] as const,
};

export type MedicalRecord = {
  name?: string;
  age?: number;
  sex?: string;
  difficulty?: string;
};

/** ScenarioResponse.medical_record is typed as unknown; narrow it for UI. */
export function projectMedicalRecord(raw: unknown): MedicalRecord {
  if (!raw || typeof raw !== "object") return {};
  return raw as MedicalRecord;
}

const VITAL_LABEL: Record<string, string> = {
  blood_pressure: "혈압",
  pulse: "맥박",
  respiration: "호흡",
  temperature: "체온",
};

type RawPsychological = {
  anxiety?: number;
  anger?: number;
  depression?: number;
};

type RawInitialState = {
  // 서버 실제 구조: top-level vital_signs + psychological
  vital_signs?: Record<string, string>;
  other_signs?: string[];
  psychological?: RawPsychological;
  // 레거시/mock 구조: nested environmental_state + psychological_state
  environmental_state?: {
    vital_signs?: Record<string, string>;
    other_signs?: string[];
  };
  psychological_state?: RawPsychological;
};

export type InitialPatientState = {
  vitalSigns: VitalSign[];
  otherSigns?: string[];
  psychological: Psychological[];
};

/** Project the unknown initial_state blob into PatientStatePanel-friendly shape. */
export function projectInitialState(
  raw: unknown
): InitialPatientState | null {
  if (!raw || typeof raw !== "object") return null;
  const state = raw as RawInitialState;

  const rawVitals = state.vital_signs ?? state.environmental_state?.vital_signs;
  const vitalSigns: VitalSign[] = rawVitals
    ? Object.entries(rawVitals).map(([key, value]) => ({
        label: VITAL_LABEL[key] ?? key,
        value: String(value),
      }))
    : [];

  const rawOther = state.other_signs ?? state.environmental_state?.other_signs;

  const psy = state.psychological ?? state.psychological_state;
  const psychological: Psychological[] = psy
    ? [
        { label: "불안", value: psy.anxiety ?? 0, tone: "danger" as const },
        { label: "분노", value: psy.anger ?? 0, tone: "warning" as const },
        { label: "우울", value: psy.depression ?? 0, tone: "subtle" as const },
      ]
    : [];

  if (
    vitalSigns.length === 0 &&
    psychological.length === 0 &&
    !rawOther?.length
  ) {
    return null;
  }

  return {
    vitalSigns,
    otherSigns: rawOther,
    psychological,
  };
}
