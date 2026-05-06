"use client";

import Link from "next/link";
import { AlertCircle, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import { ScenarioCreateModal } from "@/components/scenarios/scenario-create-modal";
import { scenariosApi, scenarioKeys } from "@/lib/api/scenarios";
import { formatSessionDate } from "@/lib/api/learners";
import { useAuthStore } from "@/lib/stores/auth";
import { useToast } from "@/lib/stores/toast";

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
                <Card className="flex items-center gap-4 px-5 py-4 transition-[box-shadow,border-color] duration-150 group-hover:border-border-strong group-hover:shadow-md cursor-pointer">
                  <PatientAvatar size={44} name={s.patient_name ?? "환자"} />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-medium text-foreground">
                        {s.disease_name ?? "시나리오"}
                      </span>
                      <span className="text-body-md text-fg-muted">
                        {s.patient_name}
                      </span>
                      {s.difficulty && <Badge>난이도 {s.difficulty}</Badge>}
                    </div>
                    <span className="text-[13px] text-fg-muted">
                      {s.last_session_at
                        ? `최근 시뮬레이션: ${formatSessionDate(s.last_session_at)} · ${s.session_count ?? 0}회 수행`
                        : "아직 시뮬레이션을 시작하지 않았어요"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-fg-subtle opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
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
                  <ChevronRight
                    className="h-4 w-4 text-fg-subtle"
                    aria-hidden
                  />
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
