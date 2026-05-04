"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthIllustration } from "@/components/auth/auth-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const loginAs = (role: "learner" | "educator") =>
    handleSubmit(() => {
      // TODO(D-?): backend has no /auth/login endpoint in the current swagger.
      // For now, set the role cookie so the (app) layout/proxy treats us as
      // authenticated, then route to the role-appropriate landing page.
      document.cookie = `role=${role}; path=/`;
      router.push(role === "learner" ? "/scenarios" : "/students");
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
            <Button type="submit" variant="primary" full>
              학습자로 시작
            </Button>
            <Button
              type="button"
              variant="secondary"
              full
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
    </>
  );
}
