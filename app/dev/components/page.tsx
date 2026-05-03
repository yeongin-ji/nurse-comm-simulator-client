"use client";

import { useState } from "react";
import {
  ArrowRight,
  Hash,
  Lock,
  LogOut,
  Mail,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsCatalog() {
  const [tts, setTts] = useState(true);
  const [profileImage, setProfileImage] = useState(false);

  return (
    <main className="min-h-full bg-surface px-6 py-12">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-10">
        <header className="flex flex-col gap-2">
          <span className="text-label-sm uppercase text-fg-subtle">Catalog</span>
          <h1 className="text-headline-lg text-foreground">컴포넌트 카탈로그</h1>
          <p className="text-body-md text-fg-muted">
            Stage B-1 시각 검증용. Hi-Fi Design.html과 비교하면서 토큰/상태가
            맞는지 확인하세요.
          </p>
        </header>

        <Section title="Button — variants">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="accent">Accent</Button>
          </div>
        </Section>

        <Section title="Button — sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Button — icons / full / disabled">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button icon={<LogOut className="h-3.5 w-3.5" />}>로그아웃</Button>
              <Button
                variant="accent"
                iconRight={<ArrowRight className="h-3.5 w-3.5" />}
              >
                계속하기
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <Button full variant="primary">
              학습자로 시작
            </Button>
          </div>
        </Section>

        <Section title="Input">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="이메일"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4 text-fg-muted" />}
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="8자 이상"
              icon={<Lock className="h-4 w-4 text-fg-muted" />}
            />
            <Input
              label="이름"
              placeholder="홍길동"
              icon={<User className="h-4 w-4 text-fg-muted" />}
            />
            <Input
              label="학번"
              placeholder="20210101"
              icon={<Hash className="h-4 w-4 text-fg-muted" />}
              suffix="필수"
            />
            <Input
              label="이메일 (에러)"
              type="email"
              defaultValue="duplicated@example.com"
              icon={<Mail className="h-4 w-4 text-fg-muted" />}
              error="이미 사용 중인 이메일이에요"
            />
            <Input
              label="이메일 (읽기 전용)"
              defaultValue="locked@example.com"
              readOnly
              icon={<Mail className="h-4 w-4 text-fg-muted" />}
            />
          </div>
        </Section>

        <Section title="Card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <p className="text-title-lg">기본 카드</p>
              <p className="mt-1 text-body-md text-fg-muted">
                shadow-xs, border, padding 24px
              </p>
            </Card>
            <Card elevated>
              <p className="text-title-lg">Elevated 카드</p>
              <p className="mt-1 text-body-md text-fg-muted">shadow-md 적용</p>
            </Card>
          </div>
        </Section>

        <Section title="Badge">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>default</Badge>
            <Badge variant="success">success</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="danger">danger</Badge>
            <Badge variant="accent">accent</Badge>
          </div>
        </Section>

        <Section title="Toggle">
          <div className="flex flex-col gap-4">
            <ToggleRow
              label="TTS 음성 합성"
              description="환자의 응답을 음성으로 읽어줘요"
              on={tts}
              onChange={setTts}
            />
            <ToggleRow
              label="환자 프로필 이미지 생성"
              description="시나리오 생성 시 환자 이미지를 자동으로 만들어요"
              on={profileImage}
              onChange={setProfileImage}
            />
            <ToggleRow
              label="비활성"
              description="disabled 상태"
              on
              disabled
            />
          </div>
        </Section>

        <Section title="Spinner">
          <div className="flex items-center gap-6">
            <Spinner size={16} />
            <Spinner size={20} />
            <Spinner size={28} />
            <Spinner size={36} />
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-lg text-foreground">{title}</h2>
      <div className="rounded-md border border-border bg-surface-elevated p-6 shadow-xs">
        {children}
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  on,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  on: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-body-md font-medium text-foreground">{label}</span>
        <span className="text-label-sm text-fg-muted">{description}</span>
      </div>
      <Toggle on={on} onChange={onChange} disabled={disabled} label={label} />
    </div>
  );
}
