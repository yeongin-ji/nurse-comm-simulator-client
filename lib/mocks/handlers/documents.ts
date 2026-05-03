import { http, HttpResponse } from "msw";
import type { components } from "@/types/api";

type DocumentResponse = components["schemas"]["handler.DocumentResponse"];

const NOW = "2026-01-15T00:00:00Z";

const DOCUMENTS: DocumentResponse[] = [
  {
    id: 1,
    disease_name: "기관지 천식",
    category_path: ["호흡기계", "폐쇄성폐질환"],
    created_at: NOW,
  },
  {
    id: 2,
    disease_name: "COPD",
    category_path: ["호흡기계", "폐쇄성폐질환"],
    created_at: NOW,
  },
  {
    id: 3,
    disease_name: "기관지 확장증",
    category_path: ["호흡기계", "폐쇄성폐질환"],
    created_at: NOW,
  },
  {
    id: 4,
    disease_name: "폐렴",
    category_path: ["호흡기계", "감염성"],
    created_at: NOW,
  },
  {
    id: 5,
    disease_name: "심부전",
    category_path: ["순환기계"],
    created_at: NOW,
  },
];

export const documentHandlers = [
  http.get("/api/v1/documents", () => HttpResponse.json(DOCUMENTS)),

  http.get("/api/v1/documents/:id", ({ params }) => {
    const id = Number(params.id);
    const doc = DOCUMENTS.find((d) => d.id === id);
    if (!doc) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
    return HttpResponse.json({
      ...doc,
      disease_details: {
        overview: `${doc.disease_name}에 대한 임상 개요 (mock)`,
      },
    });
  }),
];
