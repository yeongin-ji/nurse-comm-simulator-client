"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Hash, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthIllustration } from "@/components/auth/auth-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import { learnersApi } from "@/lib/api/learners";
import { useAuthStore } from "@/lib/stores/auth";

type SignupForm = {
  name: string;
  studentNumber: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid, isSubmitted },
  } = useForm<SignupForm>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      studentNumber: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const passwordValue = watch("password");
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation({
    mutationFn: async (form: SignupForm) => {
      const learner = await learnersApi.create({
        name: form.name,
        email: form.email,
        student_number: form.studentNumber,
        password: form.password,
      });
      // 회원가입 성공 후 자동 로그인
      const login = await authApi.login({
        email: form.email,
        password: form.password,
      });
      return { learner, login };
    },
    onSuccess: ({ learner, login }) => {
      setUser({
        id: login.id ?? learner.id ?? 0,
        name: login.name ?? learner.name ?? "",
        email: login.email ?? learner.email ?? "",
        role: "learner",
      });
      document.cookie = "role=learner; path=/";
      router.push("/scenarios");
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { error?: string } | undefined;
        const message = body?.error ?? "이미 등록된 정보가 있어요";
        if (message.includes("학번")) {
          setError("studentNumber", { type: "duplicate", message });
        } else if (message.includes("이메일")) {
          setError("email", { type: "duplicate", message });
        }
      }
    },
  });

  const onSubmit = handleSubmit((form) => mutation.mutate(form));

  return (
    <>
      <AuthIllustration variant="signup" />
      <section className="flex flex-1 items-center justify-center p-12">
        <form
          onSubmit={onSubmit}
          className="w-[340px] flex flex-col gap-6"
          noValidate
        >
          <header className="flex flex-col gap-1.5">
            <h1 className="text-headline-md text-foreground">
              학습자 계정 만들기
            </h1>
            <p className="text-body-md text-fg-muted">
              시뮬레이션을 시작하려면 계정이 필요해요
            </p>
          </header>

          <div className="flex flex-col gap-3.5">
            <Input
              label="이름"
              placeholder="실명을 입력하세요"
              icon={<User className="h-4 w-4 text-fg-subtle" />}
              autoComplete="name"
              error={errors.name?.message}
              {...register("name", {
                required: "이름을 입력해 주세요",
                minLength: { value: 2, message: "2자 이상 입력해 주세요" },
              })}
            />
            <Input
              label="학번"
              placeholder="학번을 입력하세요"
              icon={<Hash className="h-4 w-4 text-fg-subtle" />}
              error={errors.studentNumber?.message}
              {...register("studentNumber", {
                required: "학번을 입력해 주세요",
                pattern: {
                  value: /^\d{6,12}$/,
                  message: "숫자만 6~12자리로 입력해 주세요",
                },
              })}
            />
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
              placeholder="8자 이상, 영문·숫자 조합"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password", {
                required: "비밀번호를 입력해 주세요",
                pattern: {
                  value: PASSWORD_RULE,
                  message: "8자 이상, 영문·숫자를 함께 사용해 주세요",
                },
              })}
            />
            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="한 번 더 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              autoComplete="new-password"
              error={errors.passwordConfirm?.message}
              {...register("passwordConfirm", {
                required: "비밀번호를 한 번 더 입력해 주세요",
                validate: (v) =>
                  v === passwordValue || "비밀번호가 일치하지 않아요",
              })}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            full
            disabled={mutation.isPending || (isSubmitted && !isValid)}
            icon={mutation.isPending ? <Spinner size={14} /> : undefined}
          >
            {mutation.isPending ? "등록 중..." : "회원가입"}
          </Button>

          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[13px] text-fg-muted">
              이미 계정이 있으신가요?
            </span>
            <Link
              href="/"
              className="text-[13px] font-medium text-accent hover:underline underline-offset-2"
            >
              로그인
            </Link>
          </div>

          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded bg-surface-muted">
            <AlertCircle
              className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
              aria-hidden
            />
            <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
              교육자 계정은 관리자를 통해 등록할 수 있어요
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
