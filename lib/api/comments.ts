import { api } from "./client";
import type { components } from "@/types/api";

export type CommentResponse = components["schemas"]["handler.CommentResponse"];
export type AddCommentRequest =
  components["schemas"]["handler.addCommentRequest"];

export const commentsApi = {
  list: (sessionId: number) =>
    api.get<CommentResponse[]>(`/sessions/${sessionId}/comments`),
  add: (sessionId: number, body: AddCommentRequest) =>
    api.post<CommentResponse>(`/sessions/${sessionId}/comments`, body),
};

export const commentKeys = {
  all: ["comments"] as const,
  list: (sessionId: number) =>
    [...commentKeys.all, "list", sessionId] as const,
};

// TODO(D-?): replace with a real /educators/{id} fetch once backend exposes it.
const EDUCATOR_NAMES: Record<number, string> = {
  1: "박교수",
  99: "김교수",
};

export function educatorName(id: number | undefined) {
  if (id == null) return "교수";
  return EDUCATOR_NAMES[id] ?? `교수${id}`;
}

export function formatCommentDate(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
