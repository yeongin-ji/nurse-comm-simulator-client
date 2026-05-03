"use client";

import { Hash, Image as ImageIcon, Lock, Mail, Mic, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { PageShell } from "@/components/layout/page-shell";

// TODO(Stage D): fetch from /learners/{id}
const MOCK_USER = {
  role: "learner" as const,
  name: "홍길동",
  identifier: "20210101",
  email: "hong@univ.ac.kr",
};

export default function ProfilePage() {
  const isLearner = MOCK_USER.role === "learner";
  const [tts, setTts] = useState(true);
  const [profileImg, setProfileImg] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const setPw = (key: keyof typeof passwords) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPasswords((prev) => ({ ...prev, [key]: e.target.value }));

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

        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-body-lg font-semibold text-foreground">
              개인정보
            </h2>
            <Badge>비밀번호만 수정할 수 있어요</Badge>
          </div>
          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3.5">
            <Input
              label="이름"
              defaultValue={MOCK_USER.name}
              readOnly
              icon={<User className="h-4 w-4 text-fg-subtle" />}
              suffix="읽기 전용"
            />
            <Input
              label={isLearner ? "학번" : "교번"}
              defaultValue={MOCK_USER.identifier}
              readOnly
              icon={<Hash className="h-4 w-4 text-fg-subtle" />}
              suffix="읽기 전용"
            />
            <Input
              label="이메일"
              defaultValue={MOCK_USER.email}
              readOnly
              icon={<Mail className="h-4 w-4 text-fg-subtle" />}
              suffix="읽기 전용"
            />
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3.5">
            <h3 className="text-body-md font-medium text-foreground">
              비밀번호 변경
            </h3>
            <Input
              label="현재 비밀번호"
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              value={passwords.current}
              onChange={setPw("current")}
              autoComplete="current-password"
            />
            <Input
              label="새 비밀번호"
              type="password"
              placeholder="8자 이상, 영문·숫자 조합"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              value={passwords.next}
              onChange={setPw("next")}
              autoComplete="new-password"
            />
            <Input
              label="새 비밀번호 확인"
              type="password"
              placeholder="한 번 더 입력하세요"
              icon={<Lock className="h-4 w-4 text-fg-subtle" />}
              value={passwords.confirm}
              onChange={setPw("confirm")}
              autoComplete="new-password"
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-5">
          <h2 className="text-body-lg font-semibold text-foreground">설정</h2>
          <div className="h-px bg-border" />
          <SettingRow
            icon={<Mic className="h-[18px] w-[18px] text-fg-muted" />}
            title="TTS 음성 합성"
            description="환자의 응답을 음성으로 읽어줘요"
            on={tts}
            onChange={setTts}
            divider
          />
          <SettingRow
            icon={<ImageIcon className="h-[18px] w-[18px] text-fg-muted" />}
            title="환자 프로필 이미지 생성"
            description="시나리오 생성 시 환자 이미지를 자동으로 만들어요"
            on={profileImg}
            onChange={setProfileImg}
          />
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="ghost">취소</Button>
          <Button variant="primary">저장하기</Button>
        </div>
      </PageShell>
    </main>
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
