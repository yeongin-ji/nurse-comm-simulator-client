"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthIllustration } from "@/components/auth/auth-illustration";
import { LoginErrorModal } from "@/components/auth/login-error-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [errorRole, setErrorRole] = useState<"learner" | "educator" | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (form: LoginForm) =>
      authApi.login({ email: form.email, password: form.password }),
  });

  const loginAs = (role: "learner" | "educator") =>
    handleSubmit((form) => {
      mutation.mutate(form, {
        onSuccess: (res) => {
          document.cookie = `role=${res.role ?? role}; path=/`;
          const landing =
            (res.role ?? role) === "learner" ? "/scenarios" : "/students";
          router.push(landing);
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 401) {
            setErrorRole(role);
          }
        },
      });
    });

  return (
    <>
      <AuthIllustration variant="login" />
      <section className="flex flex-1 items-center justify-center p-12">
        <form
          onSubmit={loginAs("learner")}
          className="w-[340px] flex flex-col gap-7"
          noValidate
        >
          <header className="flex flex-col gap-1.5">
            <h1 className="text-headline-md text-foreground">
              다시 만나서 반가워요
            </h1>
            <p className="text-body-md text-fg-muted">
              이메일과 비밀번호를 입력해 주세요
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <Input
              label="이메일"
              type="email"
              placeholder="학교 이메일을 입력하세요"
              icon={<Mail className="h-4 w-4 text-fg-subtle" />}
              autoComplete="email"
              error={errors.email?.message}
              {...register("email", {
                required: "이메일을 입력해 주세요",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "올바른 이메일 형식이 아니에요",
                },
              })}
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password", {
                required: "비밀번호를 입력해 주세요",
              })}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              type="submit"
              variant="primary"
              full
              disabled={mutation.isPending}
              icon={mutation.isPending ? <Spinner size={14} /> : undefined}
            >
              {mutation.isPending ? "로그인 중..." : "학습자로 시작"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              full
              disabled={mutation.isPending}
              onClick={loginAs("educator")}
            >
              교육자로 시작
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[13px] text-fg-muted">
              아직 계정이 없으신가요?
            </span>
            <Link
              href="/signup"
              className="text-[13px] font-medium text-accent hover:underline underline-offset-2"
            >
              회원가입
            </Link>
          </div>
        </form>
      </section>

      <LoginErrorModal
        open={errorRole !== null}
        role={errorRole ?? "learner"}
        onClose={() => setErrorRole(null)}
      />
    </>
  );
}
