"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sessionsApi } from "@/lib/api/sessions";

// TODO(Stage D-3): replace with auth store user.id once /learners/me wires up.
const MOCK_LEARNER_ID = 1;

export type StartSessionButtonProps = {
  scenarioId: number;
};

export function StartSessionButton({ scenarioId }: StartSessionButtonProps) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () =>
      sessionsApi.create({
        scenario_id: scenarioId,
        learner_id: MOCK_LEARNER_ID,
      }),
    onSuccess: (session) => {
      if (session.id != null) router.push(`/sim/${session.id}/start`);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        full
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        icon={mutation.isPending ? <Spinner size={14} /> : undefined}
      >
        {mutation.isPending ? "세션 만드는 중..." : "시뮬레이션 시작하기"}
      </Button>
      {mutation.isError && (
        <p className="text-label-sm font-normal text-danger tracking-normal">
          세션을 만들 수 없어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
