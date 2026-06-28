"use client";

import Link from "next/link";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { ScenarioCreateModal } from "@/components/scenarios/scenario-create-modal";
import { scenariosApi, scenarioKeys } from "@/lib/api/scenarios";
import { formatSessionDate } from "@/lib/api/learners";
import { useAuthStore } from "@/lib/stores/auth";
import { useToast } from "@/lib/stores/toast";

/** 난이도(하/중/상) → 코너 탭 배경색. 미지정 시 중립 색. */
const DIFFICULTY_COLOR: Record<string, string> = {
  하: "var(--success)",
  중: "var(--warning)",
  상: "var(--danger)",
};

export default function ScenariosPage() {
  const user = useAuthStore((s) => s.user);
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: scenarios, isLoading } = useQuery({
    queryKey: scenarioKeys.list(),
    queryFn: () => scenariosApi.list(user?.id),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => scenariosApi.delete(id),
    onSuccess: () => {
      const name = deleteTarget?.name;
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: scenarioKeys.list() });
      toast(`'${name}' 시나리오가 삭제되었어요`, "success");
    },
  });

  const handleDeleteClick = (
    e: React.MouseEvent,
    id: number,
    name: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget({ id, name });
  };

  const list = scenarios ?? [];

  return (
    <main className="flex-1 bg-background">
      <PageShell width="md" className="flex flex-col gap-7 py-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
              내 시나리오
            </h1>
            <p className="text-body-md text-fg-muted">
              가상 환자를 선택해 시뮬레이션을 시작하세요
            </p>
          </div>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setModalOpen(true)}
          >
            새 시나리오 만들기
          </Button>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-fg-muted">
            <Spinner size={18} /> 시나리오를 불러오고 있어요
          </div>
        ) : list.length === 0 ? (
          <Card className="p-0">
            <EmptyState
              title="아직 시뮬레이션을 시작하지 않았어요"
              description="새 시나리오를 만들어 첫 시뮬레이션을 시작해 보세요."
              action={
                <Button onClick={() => setModalOpen(true)}>
                  새 시나리오 만들기
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {list.map((s) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="group block"
              >
                <Card className="relative flex items-stretch p-0 min-h-28 overflow-hidden transition-[box-shadow,border-color] duration-150 group-hover:border-border-strong group-hover:shadow-md cursor-pointer">
                  {/* Cinematic media panel: image fills the left edge-to-edge.
                      MOCK: patient photo isn't on ScenarioListItem yet, so we
                      hardcode the sample female-patient asset. Swap for the
                      server-provided URL once the API exposes it (see note). */}
                  <div className="relative w-32 shrink-0 self-stretch bg-navy-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/patients/vp-woman.png"
                      alt={`${s.patient_name ?? "환자"} 프로필`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Difficulty corner tab. */}
                    {s.difficulty && (
                      <span
                        className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-[0.02em] text-white shadow-sm"
                        style={{
                          background:
                            DIFFICULTY_COLOR[s.difficulty] ??
                            "var(--border-strong)",
                        }}
                      >
                        {s.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-[18px] min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-[19px] font-semibold leading-tight tracking-[-0.01em] text-foreground truncate">
                        {s.patient_name ?? "환자"}
                      </span>
                      {/* MOCK: 나이/성별은 ScenarioListItem에 아직 없어 임시값.
                          서버가 patient_age/patient_gender를 내려주면
                          `${s.patient_age}/${s.patient_gender}`로 교체. */}
                      <span className="font-mono shrink-0 self-center rounded-[5px] bg-navy-50 px-1.5 py-0.5 text-[12px] text-navy-800">
                        47/M
                      </span>
                    </div>
                    <span className="mt-0.5 text-[13px] text-fg-muted truncate">
                      {s.disease_name ? `${s.disease_name} 시나리오` : "시나리오"}
                    </span>

                    <div className="mt-auto pt-3 border-t border-surface-muted flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {s.last_session_at ? (
                          <span className="text-[12px] text-fg-subtle truncate">
                            {s.session_count ?? 0}회 수행
                          </span>
                        ) : (
                          <span className="text-[12px] text-fg-subtle truncate">
                            아직 시작 안 함
                          </span>
                        )}
                      </div>
                      {s.last_session_at && (
                        <span className="text-[12px] text-fg-subtle shrink-0">
                          {formatSessionDate(s.last_session_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="시나리오 삭제"
                    className="absolute top-2 right-2 p-1.5 rounded-md text-fg-subtle opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-all"
                    onClick={(e) =>
                      handleDeleteClick(
                        e,
                        s.id!,
                        s.disease_name ?? s.patient_name ?? "시나리오",
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageShell>

      <ScenarioCreateModal
        open={modalOpen}
        onOpenChange={(next) => {
          setModalOpen(next);
          if (!next) {
            queryClient.invalidateQueries({ queryKey: scenarioKeys.list() });
          }
        }}
      />

      <Modal
        open={deleteTarget !== null}
        onOpenChange={(next) => {
          if (deleteMutation.isPending) return;
          if (!next) setDeleteTarget(null);
        }}
        title="시나리오를 삭제할까요?"
        width={400}
        hideClose
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
              disabled={deleteMutation.isPending}
              icon={
                deleteMutation.isPending ? <Spinner size={14} /> : undefined
              }
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제하기"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-body-md text-fg-muted leading-[22px]">
            <strong className="font-medium text-foreground">
              &apos;{deleteTarget?.name}&apos;
            </strong>{" "}
            시나리오를 삭제해요. 삭제된 시나리오는 목록에서 사라지며, 이 작업은
            되돌릴 수 없어요.
          </p>
          {deleteMutation.isError && (
            <div className="flex items-start gap-2 rounded bg-danger/[0.04] border border-danger/40 px-3 py-2.5">
              <AlertCircle className="h-3.5 w-3.5 text-danger mt-0.5 shrink-0" />
              <p className="text-label-sm text-danger tracking-normal">
                삭제에 실패했어요. 잠시 후 다시 시도해 주세요.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
