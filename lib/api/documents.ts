import { api } from "./client";
import type { components } from "@/types/api";

export type DocumentResponse = components["schemas"]["handler.DocumentResponse"];

export const documentsApi = {
  list: () => api.get<DocumentResponse[]>("/documents"),
  detail: (id: number) => api.get<DocumentResponse>(`/documents/${id}`),
};

export const documentKeys = {
  all: ["documents"] as const,
  list: () => [...documentKeys.all, "list"] as const,
  detail: (id: number) => [...documentKeys.all, "detail", id] as const,
};
