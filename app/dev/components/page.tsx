"use client";

import { useState } from "react";
import {
  ArrowRight,
  FileText,
  Hash,
  Lock,
  LogOut,
  Mail,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/ui/gauge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Nav } from "@/components/layout/nav";
import { PageShell } from "@/components/layout/page-shell";
import { SimNav } from "@/components/layout/sim-nav";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingBubble } from "@/components/chat/typing-bubble";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingScreen } from "@/components/feedback/loading-screen";
import { PatientAvatar } from "@/components/sim/patient-avatar";
import { PatientStatePanel } from "@/components/sim/patient-state-panel";
import { PblProgress } from "@/components/sim/pbl-progress";
import { ScenarioTooltip } from "@/components/sim/scenario-tooltip";
import { Timer } from "@/components/sim/timer";

export default function ComponentsCatalog() {
  const [tts, setTts] = useState(true);
  const [profileImage, setProfileImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatLog, setChatLog] = useState<{ role: "user" | "patient"; text: string }[]>(
    [
      { role: "patient", text: "(거칠게 숨을 몰아쉬며) 뭐가 필요해요?" },
      {
        role: "user",
        text: "안녕하세요, 저는 담당 간호학생이에요. 지금 많이 힘드시죠?",
      },
      { role: "patient", text: "...네, 숨쉬기가 너무 힘들어요." },
    ]
  );
  const [timerStart] = useState(() => Date.now() - 156_000);
  const [shortTimerStart] = useState(() => Date.now());

  return (
    <main className="min-h-full bg-surface">
      <PageShell width="lg" className="flex flex-col gap-10 py-12">
        <header className="flex flex-col gap-2">
          <span className="text-label-sm uppercase text-fg-subtle">Catalog</span>
          <h1 className="text-headline-lg text-foreground">컴포넌트 카탈로그</h1>
          <p className="text-body-md text-fg-muted">
            Stage B-1 + B-2 시각 검증용. Hi-Fi Design.html과 비교하면서
            토큰/상태가 맞는지 확인하세요.
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

        <Section title="StatCard">
          <div className="flex gap-4">
            <StatCard label="총 세션" value="4회" />
            <StatCard label="평균 점수" value="74점" sub="최근 30일" />
            <StatCard label="시나리오" value="2종" />
          </div>
        </Section>

        <Section title="Gauge">
          <div className="flex flex-col gap-4 max-w-md">
            <Gauge label="공감적 의사소통" value={82} />
            <Gauge label="정보 수집" value={65} color="success" />
            <Gauge label="환자 안전" value={42} color="warning" />
            <Gauge label="윤리적 판단" value={18} color="danger" />
          </div>
        </Section>

        <Section title="Table">
          {(() => {
            const widths = ["80px", undefined, "100px", "80px"] as const;
            const withWidths = (contents: React.ReactNode[]) =>
              contents.map((content, i) => ({ content, width: widths[i] }));
            return (
              <Table>
                <TableRow
                  header
                  cells={withWidths(["회차", "수행일시", "상태", "점수"])}
                />
                <TableRow
                  cells={withWidths([
                    "1회차",
                    "2026-04-15 14:32",
                    <Badge key="b" variant="success">
                      완료
                    </Badge>,
                    "82점",
                  ])}
                />
                <TableRow
                  cells={withWidths([
                    "2회차",
                    "2026-04-22 09:18",
                    <Badge key="b" variant="success">
                      완료
                    </Badge>,
                    "76점",
                  ])}
                />
                <TableRow
                  cells={withWidths([
                    "3회차",
                    "2026-05-01 16:05",
                    <Badge key="b" variant="warning">
                      진행 중
                    </Badge>,
                    "—",
                  ])}
                />
              </Table>
            );
          })()}
        </Section>

        <Section title="Breadcrumb">
          <Breadcrumb
            items={[
              { label: "학생 목록", href: "/students" },
              { label: "김간호 (20210101)", href: "/students/1" },
              { label: "세션 #5" },
            ]}
          />
        </Section>

        <Section title="Modal">
          <div className="flex items-center gap-3">
            <Button onClick={() => setModalOpen(true)}>모달 열기</Button>
            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="시간이 다 됐어요"
              description="대화 시뮬레이션이 종료되었어요. 평가를 시작할게요."
              footer={
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  평가 시작하기
                </Button>
              }
            >
              <p className="text-body-md text-fg-muted">
                지금까지의 대화를 바탕으로 6개 항목을 평가합니다. 평가는 한
                번만 가능해요.
              </p>
            </Modal>
          </div>
        </Section>

        <Section title="Nav (학습자 / 교육자)">
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-border overflow-hidden">
              <Nav role="learner" userName="김간호" />
            </div>
            <div className="rounded-md border border-border overflow-hidden">
              <Nav role="educator" userName="박교수" />
            </div>
          </div>
        </Section>

        <Section title="SimNav">
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-border overflow-hidden">
              <SimNav current={0} />
            </div>
            <div className="rounded-md border border-border overflow-hidden">
              <SimNav current={1} />
            </div>
            <div className="rounded-md border border-border overflow-hidden">
              <SimNav current={2} />
            </div>
          </div>
        </Section>

        <Section title="PatientAvatar">
          <div className="flex items-end gap-4">
            <PatientAvatar name="이영수" size={32} />
            <PatientAvatar name="김미래" size={44} />
            <PatientAvatar name="박준호" size={64} />
            <PatientAvatar name="OOO" size={80} />
            <PatientAvatar name="OOO" size={28} rounded />
          </div>
        </Section>

        <Section title="ChatBubble + TypingBubble">
          <div className="flex flex-col gap-3 max-w-[560px]">
            <ChatBubble role="patient" text="(거칠게 숨을 몰아쉬며) 뭐가 필요해요? 어차피 나한테 관심 없잖아요..." />
            <ChatBubble role="user" text="안녕하세요, 저는 오늘 담당 간호학생이에요. 지금 많이 힘드시죠?" />
            <ChatBubble role="ai-peer" text="환자가 거부 반응을 보이고 있어요. 우선 신뢰를 쌓는 데 집중해 보세요." />
            <TypingBubble role="patient" />
          </div>
        </Section>

        <Section title="ChatInput">
          <div className="flex flex-col gap-3 max-w-[560px]">
            <ChatInput
              onSubmit={(text) =>
                setChatLog((prev) => [...prev, { role: "user", text }])
              }
            />
            <ChatInput
              disabled
              disabledHint="환자가 응답하고 있어요..."
              onSubmit={() => {}}
            />
            <div className="flex flex-col gap-2 mt-2">
              {chatLog.slice(-3).map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.text} />
              ))}
            </div>
          </div>
        </Section>

        <Section title="ScenarioTooltip">
          <div className="flex items-center gap-3">
            <span className="text-body-md">시나리오 정보:</span>
            <ScenarioTooltip description="COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡과 복식 호흡을 교육하려 합니다. 하지만 환자는 교육을 완강히 거부합니다." />
            <span className="text-body-md text-fg-muted">i 아이콘에 호버해 보세요</span>
          </div>
        </Section>

        <Section title="Timer">
          <div className="flex items-center gap-6">
            <Timer startedAt={timerStart} totalSeconds={600} />
            <Timer startedAt={shortTimerStart} totalSeconds={5} />
          </div>
        </Section>

        <Section title="PatientStatePanel">
          <PatientStatePanel
            vitalSigns={[
              { label: "혈압", value: "138/88" },
              { label: "맥박", value: "102 bpm" },
              { label: "호흡", value: "24회/분" },
              { label: "체온", value: "37.2℃" },
            ]}
            otherSigns={["호흡 시 천명음(wheezing) 청진됨", "입술 오므리기 호흡 자세 관찰"]}
            psychological={[
              { label: "불안", value: 72, tone: "danger" },
              { label: "분노", value: 55, tone: "warning" },
              { label: "우울", value: 20, tone: "subtle" },
            ]}
            onEnd={() => {}}
          />
        </Section>

        <Section title="PblProgress">
          <div className="max-w-[260px]">
            <PblProgress current={2} max={5} onComplete={() => {}} />
          </div>
        </Section>

        <Section title="LoadingScreen">
          <div className="rounded-md border border-border bg-background min-h-[280px] flex flex-col">
            <LoadingScreen
              title="시나리오를 만들고 있어요"
              subtitle="가상 환자 정보, 딜레마 케이스, 시나리오를 순서대로 만들어요"
            />
          </div>
        </Section>

        <Section title="EmptyState">
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="아직 시뮬레이션을 시작하지 않았어요"
            description="새 시나리오를 만들어 첫 시뮬레이션을 시작해 보세요."
            action={<Button>새 시나리오 만들기</Button>}
          />
        </Section>
      </PageShell>
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
