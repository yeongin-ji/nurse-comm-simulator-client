import { ArrowRight, Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
      <div className="w-full max-w-[560px] flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <span className="text-label-sm uppercase text-fg-subtle">
            Foundation Check
          </span>
          <h1 className="text-headline-lg text-foreground">
            토큰과 폰트가 정상 적용되었어요
          </h1>
          <p className="text-body-md text-fg-muted">
            이 화면은 Stage A 검증용 임시 페이지예요. Inter 본문 + JetBrains
            Mono, accent #2563EB, surface #FAFAFA가 의도대로 보이는지 확인하세요.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-surface-elevated p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-body-md text-fg-muted">
            <Mail className="h-4 w-4 text-accent" aria-hidden />
            <span>lucide-react가 토큰 색을 받아쓰고 있어요</span>
          </div>
          <div className="font-mono text-mono-md text-fg-subtle">
            --color-accent: #2563EB
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-on-primary text-body-md transition-colors duration-[120ms] hover:bg-[#27272A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Primary
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 py-2 text-body-md text-foreground transition-colors duration-[120ms] hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Secondary
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-on-accent text-body-md transition-colors duration-[120ms] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Accent
            </button>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md bg-success/10 p-3 text-body-md text-success">
            success
          </div>
          <div className="rounded-md bg-warning/10 p-3 text-body-md text-warning">
            warning
          </div>
          <div className="rounded-md bg-danger/10 p-3 text-body-md text-danger">
            danger
          </div>
        </section>
      </div>
    </main>
  );
}
