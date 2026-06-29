"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Image as ImageIcon, Lock, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { PageShell } from "@/components/layout/page-shell";
import { learnerKeys, learnersApi } from "@/lib/api/learners";
import { useAuthStore } from "@/lib/stores/auth";
import { useSettingsStore } from "@/lib/stores/settings";
import { cn } from "@/lib/utils/cn";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

type PasswordForm = {
  current: string;
  next: string;
  confirm: string;
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const isLearner = user?.role !== "educator";

  // 학번/교번은 인증 스토어에 없어 학습자 상세에서 보충한다(교육자용 엔드포인트는 없음).
  const learnerQuery = useQuery({
    queryKey: learnerKeys.detail(user?.id ?? 0),
    queryFn: () => learnersApi.detail(user!.id),
    enabled: !!user?.id && isLearner,
  });

  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const setTtsEnabled = useSettingsStore((s) => s.setTtsEnabled);
  const profileImageEnabled = useSettingsStore((s) => s.profileImageEnabled);
  const setProfileImageEnabled = useSettingsStore(
    (s) => s.setProfileImageEnabled
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<PasswordForm>({
    mode: "onTouched",
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const nextValue = watch("next");

  const passwordMutation = useMutation({
    // TODO(D-?): backend has no password-change endpoint in the current swagger.
    // Simulate latency so UX matches a real network call.
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return true;
    },
    onSuccess: () => {
      reset({ current: "", next: "", confirm: "" });
    },
  });

  const onSubmit = handleSubmit(() => passwordMutation.mutate());

  if (isLearner && learnerQuery.isLoading) {
    return <LoadingScreen title="프로필을 불러오고 있어요" />;
  }

  const learner = learnerQuery.data;
  // 로그인 사용자 값을 우선 사용하고, 학번은 학습자 상세에서 보충한다.
  const displayName = user?.name ?? learner?.name ?? "—";
  const displayEmail = user?.email ?? learner?.email ?? "—";
  const studentNumber = learner?.student_number ?? "—";

  return (
    <main className="flex-1 bg-background">
      <PageShell width="sm" className="flex flex-col gap-7 py-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
            프로필 및 설정
          </h1>
          <p className="text-body-md text-fg-muted">
            개인정보를 확인하고, 앱 설정을 관리할 수 있어요
          </p>
        </header>

        <div className="flex items-center gap-3.5 border-b border-border pb-6">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-50 text-[20px] font-semibold text-navy-800">
            {(displayName.trim()[0] ?? "?").toUpperCase()}
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-title-lg font-semibold text-foreground">
                {displayName}
              </span>
              <Badge variant="navy">{isLearner ? "학습자" : "교육자"}</Badge>
            </div>
            <span className="text-[13px] text-fg-muted">
              {displayEmail}
            </span>
          </div>
        </div>

        <section className="flex flex-col">
          <div className="mb-1.5 flex items-center gap-2">
            <h2 className="text-body-lg font-semibold text-foreground">
              개인정보
            </h2>
            <span className="text-[13px] text-fg-subtle">· 읽기 전용</span>
          </div>
          <InfoRow label="이름" value={displayName} />
          <InfoRow
            label={isLearner ? "학번" : "교번"}
            value={studentNumber}
          />
          <InfoRow label="이메일" value={displayEmail} last />
        </section>

        <Card className="flex flex-col gap-3.5">
          <form onSubmit={onSubmit} className="flex flex-col gap-3.5" noValidate>
            <h3 className="text-body-md font-medium text-foreground">
              비밀번호 변경
            </h3>
            <Input
              label="현재 비밀번호"
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              autoComplete="current-password"
              error={errors.current?.message}
              {...register("current", {
                required: "현재 비밀번호를 입력해 주세요",
              })}
            />
            <Input
              label="새 비밀번호"
              type="password"
              placeholder="8자 이상, 영문·숫자 조합"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              autoComplete="new-password"
              error={errors.next?.message}
              {...register("next", {
                required: "새 비밀번호를 입력해 주세요",
                pattern: {
                  value: PASSWORD_RULE,
                  message: "8자 이상, 영문·숫자를 함께 사용해 주세요",
                },
              })}
            />
            <Input
              label="새 비밀번호 확인"
              type="password"
              placeholder="한 번 더 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              autoComplete="new-password"
              error={errors.confirm?.message}
              {...register("confirm", {
                required: "비밀번호를 한 번 더 입력해 주세요",
                validate: (v) =>
                  v === nextValue || "비밀번호가 일치하지 않아요",
              })}
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={passwordMutation.isPending}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={passwordMutation.isPending}
                icon={
                  passwordMutation.isPending ? <Spinner size={14} /> : undefined
                }
              >
                {passwordMutation.isPending ? "저장 중..." : "저장하기"}
              </Button>
            </div>

            {isSubmitSuccessful && !passwordMutation.isPending && (
              <p className="text-label-sm text-success tracking-normal">
                비밀번호를 변경했어요
              </p>
            )}
          </form>
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-body-lg font-semibold text-foreground">설정</h2>
          <div className="h-px bg-border" />
          <SettingRow
            icon={<Mic className="h-[18px] w-[18px] text-fg-muted" />}
            title="TTS 음성 합성"
            description="환자의 응답을 음성으로 읽어줘요"
            on={ttsEnabled}
            onChange={setTtsEnabled}
            divider
          />
          <SettingRow
            icon={<ImageIcon className="h-[18px] w-[18px] text-fg-muted" />}
            title="환자 프로필 이미지 생성"
            description="시나리오 생성 시 환자 이미지를 자동으로 만들어요"
            on={profileImageEnabled}
            onChange={setProfileImageEnabled}
          />
        </Card>
      </PageShell>
    </main>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2.5",
        !last && "border-b border-border"
      )}
    >
      <span className="text-[13px] text-fg-muted">{label}</span>
      <span className="text-body-md text-foreground">{value}</span>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  on,
  onChange,
  divider,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  on: boolean;
  onChange: (next: boolean) => void;
  divider?: boolean;
}) {
  return (
    <div
      className={
        divider
          ? "flex items-center justify-between py-3.5 border-b border-border"
          : "flex items-center justify-between py-3.5"
      }
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5">{icon}</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-body-md font-medium text-foreground">
            {title}
          </span>
          <span className="text-[13px] text-fg-muted leading-[18px]">
            {description}
          </span>
        </div>
      </div>
      <Toggle on={on} onChange={onChange} label={title} />
    </div>
  );
}
