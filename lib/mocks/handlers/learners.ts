import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type LearnerResponse = components["schemas"]["handler.LearnerResponse"];
type CreateRequest = components["schemas"]["handler.createLearnerRequest"];

// Educator views need per-learner stats that aren't in the official swagger
// (see README "API 보완 필요"). Extend the response shape here so the UI can
// render them; the backend should add equivalent fields when the endpoint
// (`GET /learners`, `GET /learners/{id}/sessions`) is formally specified.
type LearnerWithStats = LearnerResponse & {
  session_count?: number;
  last_session_at?: string | null;
  average_score?: number | null;
};

type LearnerSession = {
  id: number;
  learner_id: number;
  scenario_id: number;
  disease: string;
  start_time: string;
  session_status: string;
  total_score: number | null;
  comment_count: number;
};

const learners = new Map<number, LearnerWithStats>();
let nextId = 2001;

const seed = (l: LearnerWithStats) => learners.set(l.id!, l);

seed({
  id: 1,
  name: "홍길동",
  email: "hong@univ.ac.kr",
  student_number: "20210101",
  created_at: "2025-09-01T00:00:00Z",
  session_count: 4,
  last_session_at: "2026-04-28",
  average_score: 74,
});
seed({
  id: 2,
  name: "김간호",
  email: "kim@univ.ac.kr",
  student_number: "20210102",
  created_at: "2025-09-01T00:00:00Z",
  session_count: 5,
  last_session_at: "2026-04-28",
  average_score: 79,
});
seed({
  id: 3,
  name: "이실습",
  email: "lee@univ.ac.kr",
  student_number: "20210202",
  created_at: "2025-09-01T00:00:00Z",
  session_count: 3,
  last_session_at: "2026-04-25",
  average_score: 82,
});
seed({
  id: 4,
  name: "박학생",
  email: "park@univ.ac.kr",
  student_number: "20210303",
  created_at: "2025-09-01T00:00:00Z",
  session_count: 7,
  last_session_at: "2026-04-29",
  average_score: 71,
});
seed({
  id: 5,
  name: "최간호",
  email: "choi@univ.ac.kr",
  student_number: "20210404",
  created_at: "2025-09-01T00:00:00Z",
  session_count: 1,
  last_session_at: "2026-04-10",
  average_score: 65,
});
seed({
  id: 6,
  name: "정실습",
  email: "jung@univ.ac.kr",
  student_number: "20210505",
  created_at: "2025-09-01T00:00:00Z",
  session_count: 0,
  last_session_at: null,
  average_score: null,
});

const SESSIONS_BY_LEARNER: Record<number, LearnerSession[]> = {
  2: [
    { id: 5005, learner_id: 2, scenario_id: 100, disease: "COPD", start_time: "2026-04-28T14:22:00Z", session_status: "완료", total_score: 82, comment_count: 0 },
    { id: 5004, learner_id: 2, scenario_id: 100, disease: "COPD", start_time: "2026-04-20T10:05:00Z", session_status: "완료", total_score: 74, comment_count: 1 },
    { id: 5003, learner_id: 2, scenario_id: 101, disease: "폐렴", start_time: "2026-04-15T16:30:00Z", session_status: "완료", total_score: 80, comment_count: 0 },
    { id: 5002, learner_id: 2, scenario_id: 100, disease: "COPD", start_time: "2026-04-10T09:20:00Z", session_status: "완료", total_score: 68, comment_count: 1 },
    { id: 5001, learner_id: 2, scenario_id: 102, disease: "심부전", start_time: "2026-04-05T11:00:00Z", session_status: "완료", total_score: 72, comment_count: 0 },
  ],
  3: [
    { id: 5101, learner_id: 3, scenario_id: 100, disease: "COPD", start_time: "2026-04-25T13:00:00Z", session_status: "완료", total_score: 84, comment_count: 0 },
    { id: 5102, learner_id: 3, scenario_id: 101, disease: "폐렴", start_time: "2026-04-18T15:30:00Z", session_status: "완료", total_score: 79, comment_count: 0 },
    { id: 5103, learner_id: 3, scenario_id: 102, disease: "심부전", start_time: "2026-04-10T11:20:00Z", session_status: "완료", total_score: 83, comment_count: 0 },
  ],
};

export const learnerHandlers = [
  http.post("/api/v1/learners", async ({ request }) => {
    const body = (await request.json()) as CreateRequest;
    await new Promise((r) => setTimeout(r, 350));

    const dupNumber = [...learners.values()].some(
      (l) => l.student_number === body.student_number
    );
    if (dupNumber) {
      return HttpResponse.json(
        { error: "이미 등록된 학번이에요" },
        { status: 409 }
      );
    }
    const dupEmail = [...learners.values()].some(
      (l) => l.email === body.email
    );
    if (dupEmail) {
      return HttpResponse.json(
        { error: "이미 사용 중인 이메일이에요" },
        { status: 409 }
      );
    }

    const id = nextId++;
    const learner: LearnerResponse = {
      id,
      name: body.name,
      email: body.email,
      student_number: body.student_number,
      created_at: new Date().toISOString(),
    };
    learners.set(id, learner);
    return HttpResponse.json(learner, { status: 201 });
  }),

  http.get("/api/v1/learners", () => {
    return HttpResponse.json([...learners.values()]);
  }),

  http.get("/api/v1/learners/:id", ({ params }) => {
    const id = Number(params.id);
    const learner = learners.get(id);
    if (!learner) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json(learner);
  }),

  http.get("/api/v1/learners/:id/sessions", ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json(SESSIONS_BY_LEARNER[id] ?? []);
  }),
];
