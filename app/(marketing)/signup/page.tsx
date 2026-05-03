"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Hash, Lock, Mail, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthIllustration } from "@/components/auth/auth-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    studentNumber: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(Stage D): POST /learners
    console.log("[signup placeholder]", form);
    router.push("/scenarios");
  };

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
              value={form.name}
              onChange={set("name")}
              autoComplete="name"
              required
            />
            <Input
              label="학번"
              placeholder="학번을 입력하세요"
              icon={<Hash className="h-4 w-4 text-fg-subtle" />}
              value={form.studentNumber}
              onChange={set("studentNumber")}
              required
            />
            <Input
              label="이메일"
              type="email"
              placeholder="학교 이메일을 입력하세요"
              icon={<Mail className="h-4 w-4 text-fg-subtle" />}
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              required
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="8자 이상, 영문·숫자 조합"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
              required
            />
            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="한 번 더 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              value={form.passwordConfirm}
              onChange={set("passwordConfirm")}
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" variant="primary" full>
            회원가입
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
