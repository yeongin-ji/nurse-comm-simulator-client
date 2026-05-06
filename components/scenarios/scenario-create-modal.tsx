"use client";

import { AlertCircle, ChevronRight, Shuffle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { documentKeys, documentsApi } from "@/lib/api/documents";
import type { DocumentResponse } from "@/lib/api/documents";
import { scenariosApi } from "@/lib/api/scenarios";
import { useAuthStore } from "@/lib/stores/auth";
import { cn } from "@/lib/utils/cn";

const DIFFICULTIES = [
  { value: "상", label: "상" },
  { value: "중", label: "중" },
  { value: "하", label: "하" },
] as const;

/** category_path에서 unique한 값 목록을 depth별로 추출 */
function getOptionsAtDepth(
  documents: DocumentResponse[],
  depth: number,
  parentPath: string[],
): string[] {
  const set = new Set<string>();
  for (const d of documents) {
    const cp = d.category_path ?? [];
    // 상위 경로가 일치하는지 확인
    const matches = parentPath.every((p, i) => cp[i] === p);
    if (matches && cp[depth] != null) {
      set.add(cp[depth]);
    }
  }
  return Array.from(set);
}

/** 선택된 경로에 해당하는 질환 문서 필터링 */
function filterDocuments(
  documents: DocumentResponse[],
  path: string[],
): DocumentResponse[] {
  return documents.filter((d) => {
    const cp = d.category_path ?? [];
    return path.every((p, i) => cp[i] === p);
  });
}

export type ScenarioCreateModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export function ScenarioCreateModal({
  open,
  onOpenChange,
}: ScenarioCreateModalProps) {
  const router = useRouter();
  const learnerId = useAuthStore((s) => s.user?.id);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
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

  // category_path의 최대 깊이 (보통 3: 질환 > 계통 > 하위분류)
  const maxDepth = useMemo(() => {
    let max = 0;
    for (const d of documents) {
      const len = d.category_path?.length ?? 0;
      if (len > max) max = len;
    }
    return max;
  }, [documents]);

  // 현재 depth에서 보여줄 항목들
  const currentDepth = selectedPath.length;
  const isAtDiseaseLevel = currentDepth >= maxDepth;

  // 카테고리 선택 단계: 다음 depth의 옵션들
  const categoryOptions = useMemo(
    () =>
      !isAtDiseaseLevel
        ? getOptionsAtDepth(documents, currentDepth, selectedPath)
        : [],
    [documents, currentDepth, selectedPath, isAtDiseaseLevel],
  );

  // 질환 선택 단계: 선택된 경로에 해당하는 문서들
  const filteredDocuments = useMemo(
    () => (isAtDiseaseLevel ? filterDocuments(documents, selectedPath) : []),
    [documents, selectedPath, isAtDiseaseLevel],
  );

  const handleCategorySelect = (option: string) => {
    setSelectedPath((prev) => [...prev, option]);
    setPickedId(null);
  };

  const handleBreadcrumbClick = (depth: number) => {
    setSelectedPath((prev) => prev.slice(0, depth));
    setPickedId(null);
  };

  const handleReset = () => {
    setSelectedPath([]);
    setPickedId(null);
  };

  const handleRandom = () => {
    if (documents.length === 0) return;
    const random = documents[Math.floor(Math.random() * documents.length)];
    if (random.id == null) return;
    setSelectedPath(random.category_path ?? []);
    setPickedId(random.id);
  };

  const onCreate = () => {
    if (pickedId == null || learnerId == null) return;
    createMutation.mutate({
      learner_id: learnerId,
      document_id: pickedId,
      difficulty,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (createMutation.isPending) return;
        if (!next) handleReset();
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
              pickedId == null ||
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
          <div className="flex items-center justify-between">
            <h3 className="text-body-md font-medium text-foreground">질환 선택</h3>
            <Button
              variant="secondary"
              size="sm"
              icon={<Shuffle className="h-3.5 w-3.5" />}
              onClick={handleRandom}
              disabled={documentsQuery.isLoading || documents.length === 0}
            >
              랜덤 선택
            </Button>
          </div>

          {/* 브레드크럼 네비게이션 */}
          {selectedPath.length > 0 && (
            <div className="flex items-center gap-1 rounded bg-surface-muted px-3 py-2 text-label-sm tracking-normal flex-wrap">
              {selectedPath.map((crumb, i) => (
                <span key={`${crumb}-${i}`} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight
                      className="h-3 w-3 text-fg-subtle"
                      aria-hidden
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(i)}
                    className="font-medium text-accent hover:underline underline-offset-2"
                  >
                    {crumb}
                  </button>
                </span>
              ))}
              {!isAtDiseaseLevel && (
                <>
                  <ChevronRight
                    className="h-3 w-3 text-fg-subtle"
                    aria-hidden
                  />
                  <span className="text-fg-subtle">선택 중</span>
                </>
              )}
              {isAtDiseaseLevel && pickedId == null && (
                <>
                  <ChevronRight
                    className="h-3 w-3 text-fg-subtle"
                    aria-hidden
                  />
                  <span className="text-fg-subtle">질환 선택 중</span>
                </>
              )}
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
          ) : !isAtDiseaseLevel ? (
            /* 카테고리 선택 단계 */
            <div className="rounded border border-border overflow-hidden">
              {categoryOptions.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleCategorySelect(option)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors",
                    i < categoryOptions.length - 1 && "border-b border-border",
                    "bg-background hover:bg-surface",
                  )}
                >
                  <span className="text-body-md text-foreground">{option}</span>
                  <ChevronRight
                    className="h-4 w-4 text-fg-subtle"
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          ) : (
            /* 질환 선택 단계 (라디오) */
            <div className="rounded border border-border overflow-hidden">
              {filteredDocuments.map((d, i) => {
                const selected = d.id === pickedId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => d.id != null && setPickedId(d.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors",
                      i < filteredDocuments.length - 1 &&
                        "border-b border-border",
                      selected
                        ? "bg-[rgba(37,99,235,0.05)]"
                        : "bg-background hover:bg-surface",
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                        selected
                          ? "border-accent bg-accent"
                          : "border-border bg-transparent",
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
                          : "font-normal text-foreground",
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
                      : "border-border bg-background text-fg-muted hover:bg-surface",
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
            가상환자 정보, 딜레마 케이스, 시나리오를 순서대로 만들어요 (약
            10~20초)
          </p>
        </div>
      </div>
    </Modal>
  );
}
