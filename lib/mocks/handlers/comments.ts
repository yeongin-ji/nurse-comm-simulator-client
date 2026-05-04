import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type CommentResponse = components["schemas"]["handler.CommentResponse"];
type AddRequest = components["schemas"]["handler.addCommentRequest"];

const comments = new Map<number, CommentResponse[]>();
let nextId = 9001;

function defaultFor(sessionId: number): CommentResponse[] {
  return [
    {
      id: 1,
      session_id: sessionId,
      educator_id: 99,
      content:
        "경청 부분에서 많이 나아졌어요. 다음에는 환자 감정 반영 연습을 더 해보세요.",
      created_at: "2026-04-29T00:00:00Z",
    },
  ];
}

function listFor(sessionId: number): CommentResponse[] {
  if (!comments.has(sessionId)) comments.set(sessionId, defaultFor(sessionId));
  return comments.get(sessionId)!;
}

export const commentHandlers = [
  http.get("/api/v1/sessions/:id/comments", ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json(listFor(id));
  }),

  http.post("/api/v1/sessions/:id/comments", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as AddRequest;
    await new Promise((r) => setTimeout(r, 300));
    const list = listFor(id);
    const created: CommentResponse = {
      id: nextId++,
      session_id: id,
      educator_id: body.educator_id,
      content: body.content,
      created_at: new Date().toISOString(),
    };
    list.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
