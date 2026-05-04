# NurseComm Client

간호학생의 의사소통 역량 강화를 위한 시뮬레이션 웹 클라이언트. Next.js 16 (App Router) + React 19 + Tailwind v4.

## Quick Start

```bash
cp .env.example .env.local   # NEXT_PUBLIC_USE_MSW=1 (MSW 모킹 활성화)
npm install
npm run dev
```

http://localhost:3000 에서 확인. `/dev/components` 에는 디자인 카탈로그가 있습니다.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | dev server (Turbopack) |
| `npm run build` / `npm start` | production build / start |
| `npm run lint` | ESLint flat config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run gen:api` | swagger 2.0 → OpenAPI 3 → `types/api.d.ts` 자동 생성 |

## Stack

- Next.js 16.2.4 (App Router, RSC, `proxy.ts`)
- React 19.2.4
- TypeScript strict
- Tailwind CSS v4 (`@theme` 기반 토큰)
- TanStack Query v5 + Zustand (auth/settings)
- react-hook-form
- @radix-ui/react-dialog (Modal)
- MSW v2 (browser worker)
- lucide-react

## Design Handoff

핸드오프 자료(`design_handoff_nursecomm/`)에 토큰·시나리오·swagger·PRD가 있습니다. 자세한 화면/컴포넌트 명세는 [design_handoff_nursecomm/README.md](design_handoff_nursecomm/README.md) 참고. 디자인은 코드베이스의 `app/`, `components/`로 옮겨졌고 핸드오프 폴더는 lint/build 대상에서 제외됩니다.

## API Mocking (MSW)

`NEXT_PUBLIC_USE_MSW=1`이면 [lib/mocks/handlers/](lib/mocks/handlers/)의 핸들러가 `/api/v1/*` 요청을 모두 가로채 mock 응답을 반환합니다. swagger에 명시된 16개 endpoint + 보완 필요 항목(`GET /learners`, `GET /learners/{id}/sessions`)까지 포함.

실제 백엔드와 연결하려면 `.env.local`에서 `NEXT_PUBLIC_USE_MSW`를 비우고, 필요시 `NEXT_PUBLIC_API_BASE_URL`을 설정하세요.

## 주요 구조

```
app/
├── (marketing)/  # /, /signup
├── (app)/        # /scenarios, /history, /students, /profile
├── (sim)/sim/[sessionId]/  # /start, /pbl, /summary, /chat, /result
└── dev/components/         # 디자인 카탈로그
components/
├── ui/           # Button, Input, Card, Modal, Gauge, ...
├── layout/       # Nav, SimNav, PageShell, Breadcrumb
├── chat/         # ChatBubble, TypingBubble, ChatInput
├── sim/          # PatientStatePanel, Timer, ScenarioTooltip, ...
├── auth/         # AuthIllustration
├── educator/     # CommentCard, CommentForm, ConversationLog
└── feedback/     # LoadingScreen, EmptyState
lib/
├── api/          # fetch wrapper + 도메인별 endpoint
├── mocks/        # MSW worker + handlers
├── stores/       # Zustand (auth, settings)
├── query/        # React Query Provider
└── utils/cn.ts   # tailwind-merge with custom text-* tokens
proxy.ts          # Next.js 16 보호 라우트 가드 (구 middleware.ts)
```
