"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils/cn";

const CATEGORY_PATH = ["호흡기계", "폐쇄성폐질환"] as const;

const DISEASES = [
  { id: "asthma", name: "기관지 천식" },
  { id: "copd", name: "COPD" },
  { id: "bronchiectasis", name: "기관지 확장증" },
] as const;

const DIFFICULTIES = [
  { value: "low", label: "하" },
  { value: "mid", label: "중" },
  { value: "high", label: "상" },
] as const;

export type ScenarioCreateModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export function ScenarioCreateModal({
  open,
  onOpenChange,
}: ScenarioCreateModalProps) {
  const router = useRouter();
  const [diseaseId, setDiseaseId] = useState<string>("asthma");
  const [difficulty, setDifficulty] = useState<string>("mid");

  const onCreate = () => {
    // TODO(Stage D): POST /scenarios with { diseaseId, difficulty }
    console.log("[scenario create placeholder]", { diseaseId, difficulty });
    onOpenChange(false);
    router.push("/scenarios/new-mock-id");
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="새 시나리오 만들기"
      width={480}
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={onCreate}>
            만들기
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-body-md font-medium text-foreground">
              질환 선택
            </h3>
            <Button variant="secondary" size="sm">
              랜덤 선택
            </Button>
          </div>
          <div className="flex items-center gap-1.5 rounded bg-surface-muted px-3 py-2 text-label-sm tracking-normal">
            {CATEGORY_PATH.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-fg-subtle">/</span>}
                <span className="font-medium text-accent cursor-pointer">
                  {crumb}
                </span>
              </span>
            ))}
            <span className="text-fg-subtle">/ 선택 중</span>
          </div>
          <div className="rounded border border-border overflow-hidden">
            {DISEASES.map((d, i) => {
              const selected = d.id === diseaseId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDiseaseId(d.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors",
                    i < DISEASES.length - 1 && "border-b border-border",
                    selected
                      ? "bg-[rgba(37,99,235,0.05)]"
                      : "bg-background hover:bg-surface"
                  )}
                >
                  <span
                    className={cn(
                      "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                      selected
                        ? "border-accent bg-accent"
                        : "border-border bg-transparent"
                    )}
                  >
                    {selected && (
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-body-md",
                      selected
                        ? "font-medium text-foreground"
                        : "font-normal text-foreground"
                    )}
                  >
                    {d.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-body-md font-medium text-foreground">난이도</h3>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => {
              const selected = d.value === difficulty;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={cn(
                    "flex-1 h-9 rounded border text-body-md font-medium transition-colors duration-[120ms]",
                    selected
                      ? "border-primary bg-primary text-on-primary"
                      : "border-border bg-background text-fg-muted hover:bg-surface"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-start gap-2 rounded bg-surface-muted px-3.5 py-2.5">
          <AlertCircle
            className="h-3.5 w-3.5 text-fg-subtle mt-0.5 shrink-0"
            aria-hidden
          />
          <p className="text-label-sm font-normal text-fg-muted leading-[18px] tracking-normal">
            가상환자 정보, 딜레마 케이스, 시나리오를 순서대로 만들어요 (약 10~20초)
          </p>
        </div>
      </div>
    </Modal>
  );
}
