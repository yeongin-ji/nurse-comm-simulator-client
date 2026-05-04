import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type LearnerResponse = components["schemas"]["handler.LearnerResponse"];
type CreateRequest = components["schemas"]["handler.createLearnerRequest"];

const learners = new Map<number, LearnerResponse>();
let nextId = 2001;

// Pre-seed a known learner so duplicate checks have something to hit.
learners.set(1, {
  id: 1,
  name: "홍길동",
  email: "hong@univ.ac.kr",
  student_number: "20210101",
  created_at: "2025-09-01T00:00:00Z",
});

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

  http.get("/api/v1/learners/:id", ({ params }) => {
    const id = Number(params.id);
    const learner = learners.get(id);
    if (!learner) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json(learner);
  }),
];
