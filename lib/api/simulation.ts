import { api } from "./client";
import type { components } from "@/types/api";
import type {
  Psychological,
  VitalSign,
} from "@/components/sim/patient-state-panel";

export type SimulateTurnRequest =
  components["schemas"]["handler.simTurnRequest"];
export type SimulateTurnResponse =
  components["schemas"]["handler.SimulateTurnResponse"];

export const simulationApi = {
  sendTurn: (sessionId: number, body: SimulateTurnRequest) =>
    api.post<SimulateTurnResponse>(`/sessions/${sessionId}/simulate`, body),
};

const VITAL_LABEL: Record<string, string> = {
  blood_pressure: "혈압",
  pulse: "맥박",
  respiration: "호흡",
  temperature: "체온",
};

type RawState = {
  vital_signs?: Record<string, string>;
  other_signs?: string[];
  psychological?: { anxiety?: number; anger?: number; depression?: number };
};

/**
 * Best-effort projection of SimulateTurnResponse.current_state (typed as unknown)
 * into the shape PatientStatePanel renders.
 */
export function projectPatientState(state: unknown): {
  vitalSigns: VitalSign[];
  otherSigns?: string[];
  psychological: Psychological[];
} | null {
  if (!state || typeof state !== "object") return null;
  const raw = state as RawState;

  const vitalSigns: VitalSign[] = raw.vital_signs
    ? Object.entries(raw.vital_signs).map(([key, value]) => ({
        label: VITAL_LABEL[key] ?? key,
        value: String(value),
      }))
    : [];

  const psy = raw.psychological;
  const psychological: Psychological[] = psy
    ? [
        { label: "불안", value: psy.anxiety ?? 0, tone: "danger" as const },
        { label: "분노", value: psy.anger ?? 0, tone: "warning" as const },
        { label: "우울", value: psy.depression ?? 0, tone: "subtle" as const },
      ]
    : [];

  if (vitalSigns.length === 0 && psychological.length === 0 && !raw.other_signs?.length) return null;
  return { vitalSigns, otherSigns: raw.other_signs, psychological };
}
