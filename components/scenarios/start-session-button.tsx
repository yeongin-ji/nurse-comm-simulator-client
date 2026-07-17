"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sessionsApi } from "@/lib/api/sessions";
import { useAuthStore } from "@/lib/stores/auth";

export type StartSessionButtonProps = {
  scenarioId: number;
  /** 버튼 라벨 (기본: "시뮬레이션 시작하기") */
  label?: string;
  /** 버튼을 컨테이너 너비로 채울지 여부 (기본: true) */
  full?: boolean;
};

export function StartSessionButton({
  scenarioId,
  label = "시뮬레이션 시작하기",
  full = true,
}: StartSessionButtonProps) {
  const router = useRouter();
  const learnerId = useAuthStore((s) => s.user?.id);
  const mutation = useMutation({
    mutationFn: () =>
      sessionsApi.create({
        scenario_id: scenarioId,
        learner_id: learnerId ?? 0,
      }),
    onSuccess: (session) => {
      if (session.id != null) router.push(`/sim/${session.id}/pbl`);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        full={full}
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        icon={mutation.isPending ? <Spinner size={14} /> : undefined}
        iconRight={
          mutation.isPending ? undefined : <ArrowRight className="h-4 w-4" />
        }
      >
        {mutation.isPending ? "세션 만드는 중..." : label}
      </Button>
      {mutation.isError && (
        <p className="text-label-sm font-normal text-danger tracking-normal">
          세션을 만들 수 없어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
