"use client";

import { AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import { scenariosApi } from "@/lib/api/scenarios";
import { cn } from "@/lib/utils/cn";

const DIFFICULTIES = [
  { value: "하", label: "하" },
  { value: "중", label: "중" },
  { value: "상", label: "상" },
] as const;

// TODO(Stage D-3): replace with auth store user.id once /learners/me wires up.
const MOCK_LEARNER_ID = 1;

export type ScenarioCreateModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export function ScenarioCreateModal({
  open,
  onOpenChange,
}: ScenarioCreateModalProps) {
  const router = useRouter();
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string>("중");

  const documentsQuery = useQuery({
    queryKey: documentKeys.list(),
    queryFn: documentsApi.list,
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: scenariosApi.create,
    onSuccess: (res) => {
      onOpenChange(false);
      const id = res.scenario?.id;
      if (id) router.push(`/scenarios/${id}`);
    },
  });

  const documents = documentsQuery.data ?? [];
  // Default selection follows the first loaded document until the user picks one.
  const documentId = pickedId ?? documents[0]?.id ?? null;
  const breadcrumb = documents.find((d) => d.id === documentId)?.category_path;

  const onCreate = () => {
    if (documentId == null) return;
    createMutation.mutate({
      learner_id: MOCK_LEARNER_ID,
      document_id: documentId,
      difficulty,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (createMutation.isPending) return;
        onOpenChange(next);
      }}
      title="새 시나리오 만들기"
      width={480}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={onCreate}
            disabled={
              documentId == null ||
              documentsQuery.isLoading ||
              createMutation.isPending
            }
            icon={
              createMutation.isPending ? <Spinner size={14} /> : undefined
            }
          >
            {createMutation.isPending ? "만드는 중..." : "만들기"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h3 className="text-body-md font-medium text-foreground">질환 선택</h3>

          {breadcrumb && breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 rounded bg-surface-muted px-3 py-2 text-label-sm tracking-normal">
              {breadcrumb.map((crumb, i) => (
                <span key={`${crumb}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-fg-subtle">/</span>}
                  <span className="font-medium text-accent">{crumb}</span>
                </span>
              ))}
              <span className="text-fg-subtle">/ 선택 중</span>
            </div>
          )}

          {documentsQuery.isLoading ? (
            <div className="flex items-center gap-2 rounded border border-border px-3.5 py-3 text-body-md text-fg-muted">
              <Spinner size={14} /> 질환 목록을 불러오고 있어요
            </div>
          ) : documentsQuery.isError ? (
            <div className="rounded border border-danger/40 bg-danger/[0.04] px-3.5 py-2.5 text-body-md text-danger">
              질환 목록을 불러오지 못했어요. 다시 시도해 주세요.
            </div>
          ) : (
            <div className="rounded border border-border overflow-hidden">
              {documents.map((d, i) => {
                const selected = d.id === documentId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => d.id != null && setPickedId(d.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors",
                      i < documents.length - 1 && "border-b border-border",
                      selected
                        ? "bg-[rgba(37,99,235,0.05)]"
                        : "bg-background hover:bg-surface"
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                        selected
                          ? "border-accent bg-accent"
                          : "border-border bg-transparent"
                      )}
                    >
                      {selected && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-body-md",
                        selected
                          ? "font-medium text-foreground"
                          : "font-normal text-foreground"
                      )}
                    >
                      {d.disease_name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-body-md font-medium text-foreground">난이도</h3>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => {
              const selected = d.value === difficulty;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={cn(
                    "flex-1 h-9 rounded border text-body-md font-medium transition-colors duration-[120ms]",
                    selected
                      ? "border-primary bg-primary text-on-primary"
                      : "border-border bg-background text-fg-muted hover:bg-surface"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </section>

        {createMutation.isError && (
          <div className="rounded border border-danger/40 bg-danger/[0.04] px-3.5 py-2.5 text-body-md text-danger">
            시나리오 생성에 실패했어요. 잠시 후 다시 시도해 주세요.
          </div>
        )}

        <div className="flex items-start gap-2 rounded bg-surface-muted px-3.5 py-2.5">
          <AlertCircle
            className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
            aria-hidden
          />
          <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            가상환자 정보, 딜레마 케이스, 시나리오를 순서대로 만들어요 (약 10~20초)
          </p>
        </div>
      </div>
    </Modal>
  );
}
