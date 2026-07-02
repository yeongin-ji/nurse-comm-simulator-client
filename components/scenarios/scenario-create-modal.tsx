"use client";

import { AlertCircle, ChevronRight, Shuffle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { COMMUNICATION_TIPS } from "@/lib/constants/communication-tips";
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

/** 선택한 난이도가 환자 응대에서 의미하는 바 안내 */
const DIFFICULTY_HINTS: Record<string, string> = {
  하: "환자가 비교적 협조적이고 감정 기복이 적어요. 기본적인 의사소통을 연습하기 좋아요.",
  중: "환자가 때때로 불안이나 저항을 보여요. 상황에 맞춰 유연하게 대응해야 해요.",
  상: "환자의 감정 변화가 크고 딜레마도 복잡해요. 높은 수준의 의사소통 역량이 필요해요.",
};

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
  // 생성 성공 후 상세 페이지로 이동이 끝날 때까지 로딩 화면을 유지 (chat 평가 패턴과 동일)
  const [redirecting, setRedirecting] = useState(false);

  const documentsQuery = useQuery({
    queryKey: documentKeys.list(),
    queryFn: documentsApi.list,
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: scenariosApi.create,
    onSuccess: (res) => {
      const id = res.scenario?.id;
      if (id) {
        // 모달을 닫지 않고 로딩 화면을 유지한 채 이동 — 닫으면 한 프레임 깜빡임 발생
        setRedirecting(true);
        router.push(`/scenarios/${id}`);
      } else {
        onOpenChange(false);
      }
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

  // 시나리오 생성은 10~20초 걸리므로, 평가 화면처럼 풀스크린 로딩으로 전환한다.
  if (createMutation.isPending || redirecting) {
    return (
      <div className="fixed inset-0 z-[60] flex bg-background">
        <LoadingScreen
          title="시나리오를 만들고 있어요"
          steps={[
            "가상환자 정보를 만들고 있어요",
            "환자 배경과 병력을 정리하고 있어요",
            "딜레마 케이스를 구성하고 있어요",
            "시나리오 흐름을 작성하고 있어요",
            "세부 내용을 다듬고 있어요",
            "거의 다 됐어요",
          ]}
          tips={COMMUNICATION_TIPS}
          // TODO: 백엔드가 현재 생성 단계를 내려주면 currentStep={...}로 제어.
        />
      </div>
    );
  }

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
            disabled={pickedId == null || documentsQuery.isLoading}
          >
            만들기
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-body-md font-medium text-foreground">질환 선택</h3>
            <Button
              variant="accent"
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
            <div className="flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-2 text-label-sm tracking-normal flex-wrap">
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
            <div className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-3 text-body-md text-fg-muted">
              <Spinner size={14} /> 질환 목록을 불러오고 있어요
            </div>
          ) : documentsQuery.isError ? (
            <div className="rounded-lg border border-danger/40 bg-danger/[0.04] px-3.5 py-2.5 text-body-md text-danger">
              질환 목록을 불러오지 못했어요. 다시 시도해 주세요.
            </div>
          ) : !isAtDiseaseLevel ? (
            /* 카테고리 선택 단계 */
            <div className="rounded-lg border border-border overflow-hidden">
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
            <div className="rounded-lg border border-border overflow-hidden">
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
                        ? "bg-accent-surface"
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
                    "flex-1 h-9 rounded-full border text-body-md font-medium transition-colors duration-[120ms]",
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
          <div className="rounded-lg border border-danger/40 bg-danger/[0.04] px-3.5 py-2.5 text-body-md text-danger">
            시나리오 생성에 실패했어요. 잠시 후 다시 시도해 주세요.
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg bg-surface-muted px-3.5 py-2.5">
          <AlertCircle
            className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
            aria-hidden
          />
          <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            <span className="font-medium text-foreground">난이도 {difficulty}</span>{" "}
            · {DIFFICULTY_HINTS[difficulty]}
          </p>
        </div>
      </div>
    </Modal>
  );
}
