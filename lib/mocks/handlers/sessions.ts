import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type CreateRequest = components["schemas"]["handler.createSessionRequest"];
type SessionResponse = components["schemas"]["handler.SessionResponse"];
type AdvanceRequest = components["schemas"]["handler.advancePhaseRequest"];

const sessions = new Map<number, SessionResponse>();
let nextId = 5001;

function makeSession(scenarioId: number, learnerId: number): SessionResponse {
  const id = nextId++;
  const session: SessionResponse = {
    id,
    scenario_id: scenarioId,
    learner_id: learnerId,
    current_phase: "PBL",
    session_status: "ACTIVE",
    evaluation_status: "PENDING",
    simulation_duration_seconds: 0,
    start_time: new Date().toISOString(),
  };
  sessions.set(id, session);
  return session;
}

export const sessionHandlers = [
  http.post("/api/v1/sessions", async ({ request }) => {
    const body = (await request.json()) as CreateRequest;
    await new Promise((r) => setTimeout(r, 250));
    const session = makeSession(body.scenario_id, body.learner_id);
    return HttpResponse.json(session, { status: 201 });
  }),

  http.get("/api/v1/sessions/:id", ({ params }) => {
    const id = Number(params.id);
    const session = sessions.get(id);
    if (!session) {
      // Synthesize for ad-hoc IDs (e.g. when the user navigates directly).
      return HttpResponse.json(makeSession(2, 1));
    }
    return HttpResponse.json(session);
  }),

  http.post("/api/v1/sessions/:id/phase", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as AdvanceRequest;
    const session = sessions.get(id);
    if (!session) {
      return HttpResponse.json({ error: "session not found" }, { status: 404 });
    }
    const next = { ...session, current_phase: body.phase };
    sessions.set(id, next);
    return HttpResponse.json(next);
  }),
];
