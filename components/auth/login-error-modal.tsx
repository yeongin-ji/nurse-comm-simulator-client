"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LoginErrorModalProps = {
  open: boolean;
  role: "learner" | "educator";
  onClose: () => void;
};

export function LoginErrorModal({ open, role, onClose }: LoginErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card elevated className="w-[400px] flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/8">
            <AlertCircle className="h-5 w-5 text-danger" />
          </div>
          <div>
            <p className="text-[16px] font-semibold text-foreground">
              로그인할 수 없어요
            </p>
            <p className="text-[13px] text-fg-muted">
              {role === "learner" ? "학습자" : "교육자"} 계정
            </p>
          </div>
        </div>

        <hr className="border-border" />

        <p className="text-body-md text-fg-muted leading-[22px]">
          이메일 또는 비밀번호가 올바르지 않아요.
          <br />
          입력하신 정보를 다시 확인해 주세요.
        </p>

        {role === "educator" && (
          <div className="flex flex-col gap-1 rounded-md bg-surface-muted px-3.5 py-3">
            <p className="text-[13px] font-medium text-foreground">
              교육자 계정이 없으신가요?
            </p>
            <p className="text-[13px] text-fg-muted leading-5">
              교육자 등록은 관리자에게 문의해 주세요
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="primary" onClick={onClose}>
            다시 시도할게요
          </Button>
        </div>
      </Card>
    </div>
  );
}
