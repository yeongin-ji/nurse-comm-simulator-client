# Handoff: NurseComm — 간호학생 의사소통 시뮬레이션 프로그램

## Overview

간호학생이 가상 환자와 대화 시뮬레이션을 수행하고, AI 기반 평가를 받을 수 있는 웹 애플리케이션입니다. **학습자**와 **교육자** 두 역할로 분리되며, 학습자는 시나리오 생성 → PBL → 대화 시뮬레이션 → 디브리핑 순으로 시뮬레이션을 수행하고, 교육자는 학생들의 수행 결과를 열람하고 코멘트를 남길 수 있습니다.

## About the Design Files

이 번들의 파일들은 **HTML로 제작된 디자인 레퍼런스**입니다. 실제 프로덕션 코드가 아니며, **TypeScript / React / Next.js** 환경에서 이 디자인들을 재현해야 합니다. HTML 파일을 직접 사용하지 마세요.

## Fidelity

**High-fidelity (hifi)**: 최종 색상, 타이포그래피, 간격, 호버/포커스 상태가 반영된 완성형 디자인입니다. 개발 시 픽셀 단위로 재현해야 합니다.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules 또는 Tailwind CSS (디자인 토큰 기반)
- **Icons**: Lucide React (`lucide-react`)
- **Font**: Inter (Google Fonts), JetBrains Mono (코드/수치용)

---

## Design Tokens

### Colors

```typescript
const colors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  'surface-muted': '#F4F4F5',
  'surface-elevated': '#FFFFFF',
  border: '#E4E4E7',
  'border-strong': '#D4D4D8',
  foreground: '#09090B',
  'foreground-muted': '#52525B',
  'foreground-subtle': '#A1A1AA',
  primary: '#18181B',
  'on-primary': '#FAFAFA',
  accent: '#2563EB',
  'on-accent': '#FFFFFF',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  'focus-ring': '#2563EB',
};
```

### Typography

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| display-lg | Inter | 56px | 600 | 60px | -0.03em |
| headline-lg | Inter | 32px | 600 | 40px | -0.02em |
| headline-md | Inter | 24px | 600 | 32px | -0.01em |
| title-lg | Inter | 18px | 500 | 28px | — |
| body-lg | Inter | 16px | 400 | 24px | — |
| body-md | Inter | 14px | 400 | 20px | — |
| label-sm | Inter | 12px | 500 | 16px | 0.02em |
| mono-md | JetBrains Mono | 13px | 400 | 20px | — |

### Spacing

- Unit: 4px (모든 간격은 4의 배수)
- Gutter: 16px
- Container padding: 24px
- Card gap: 16px
- Section margin: 48px
- Page max width: 1120px

### Border Radius

| Token | Value |
|-------|-------|
| sm | 4px |
| DEFAULT | 6px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

### Elevation

```css
--shadow-xs: 0 1px 1px 0 rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 8px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04);
```

---

## UX Writing Principles

1. **간결하게**: 불필요한 표현 지양, 스캔 효율 극대화
2. **구어체**: "~해요" 체, 자연스러운 대화체 사용
3. **예측 가능**: 다음 화면의 동작을 미리 안내 (예: "PBL 단계에서 간호 방향을 논의한 뒤, 가상 환자와 대화를 시작해요")
4. **정중한 권유**: 강요 대신 부드럽게 (예: "다시 시도할게요" / "시간이 다 됐어요")
5. **공감**: 사용자 상황에 맞는 정서적 디테일 (예: "다시 만나서 반가워요")

---

## Routing Structure

```
/                          → 로그인 (비인증 시)
/signup                    → 학습자 회원가입
/profile                   → 프로필 및 설정

# 학습자
/scenarios                 → 시나리오 목록
/scenarios/[id]            → 시나리오 상세
/history                   → 학습 이력
/history/[sessionId]       → 세션 결과 상세

# 시뮬레이션 (세션 기반)
/sim/[sessionId]/start     → 시뮬레이션 시작 확인
/sim/[sessionId]/pbl       → PBL 대화
/sim/[sessionId]/summary   → PBL 요약
/sim/[sessionId]/chat      → 대화 시뮬레이션
/sim/[sessionId]/result    → 디브리핑 (평가 결과)

# 교육자
/students                  → 학생 목록
/students/[learnerId]      → 학생별 세션 이력
/students/[learnerId]/sessions/[sessionId] → 세션 상세 + 코멘트
```

---

## Screens / Views

### 1. 로그인 (`/`)

- **Purpose**: 이메일/비밀번호로 로그인, 역할(학습자/교육자) 선택
- **Layout**: 2컬럼 — 좌측 44% 일러스트 패널 (연한 블루 그라데이션 배경), 우측 56% 로그인 폼
- **Components**:
  - 좌측: 장식 원형 SVG + 일러스트 플레이스홀더 + 캐치프레이즈 "안전한 환경에서 연습하고, 자신감을 키우세요"
  - 우측: 제목 "다시 만나서 반가워요" (headline-md, 600) + 이메일 입력(Mail 아이콘) + 비밀번호 입력(Lock 아이콘) + "학습자로 시작" (primary 버튼, full width) + "교육자로 시작" (secondary 버튼, full width) + 회원가입 링크
- **States**: 로그인 실패 시 모달(학습자/교육자 별도)

### 2. 회원가입 (`/signup`)

- **Purpose**: 학습자 계정 생성
- **Layout**: 로그인과 동일한 2컬럼 구조
- **Fields**: 이름(User 아이콘), 학번(Hash 아이콘), 이메일(Mail 아이콘), 비밀번호(Lock 아이콘), 비밀번호 확인(Lock 아이콘)
- **Validation**: 인라인 에러 메시지 (빨간 border + 에러 텍스트)
  - "이미 등록된 학번이에요"
  - "이미 사용 중인 이메일이에요"
  - "8자 이상, 영문·숫자를 함께 사용해 주세요"
  - "비밀번호가 일치하지 않아요"
- **Note**: "교육자 계정은 관리자를 통해 등록할 수 있어요" (info note, AlertCircle 아이콘)

### 3. 프로필 및 설정 (`/profile`)

- **Purpose**: 개인정보 확인, 비밀번호 변경, 앱 설정
- **Layout**: 단일 컬럼 (max-width 560px, 중앙 정렬)
- **개인정보 카드**:
  - 읽기 전용 필드 (회색 배경 + "읽기 전용" suffix): 이름, 학번/교번, 이메일
  - 비밀번호 변경: 현재/새/확인 3개 필드
- **설정 카드**:
  - TTS 음성 합성 (토글, Mic 아이콘) — "환자의 응답을 음성으로 읽어줘요"
  - 환자 프로필 이미지 생성 (토글, Image 아이콘) — "시나리오 생성 시 환자 이미지를 자동으로 만들어요"
- **Buttons**: 취소(ghost) + 저장하기(primary)

### 4. 시나리오 목록 (`/scenarios`)

- **Purpose**: 내 시나리오 목록 확인, 새 시나리오 생성
- **Layout**: 단일 컬럼 (max-width 900px)
- **Header**: "내 시나리오" + "새 시나리오 만들기" 버튼 (+ 아이콘)
- **카드 리스트**: 각 카드 — 환자 아바타(AI 일러스트) + 질환명/환자정보/난이도 배지 + 최근 수행일 + chevron 화살표
- **Hover**: 카드 shadow 증가 + border-color 진하게
- **Empty state**: 시뮬레이션 미수행 시 "아직 시뮬레이션을 시작하지 않았어요"

### 5. 시나리오 생성 (모달)

- **Purpose**: 질환 선택 + 난이도 선택 → AI 시나리오 생성
- **Layout**: 모달 (480px, 중앙, 배경 딤)
- **질환 선택**:
  - "랜덤 선택" 버튼 (secondary, sm)
  - 브레드크럼: 호흡기계 / 폐쇄성폐질환 / 선택 중 (배경 surface-muted, 링크 accent)
  - 라디오 리스트: 선택 시 accent 배경 + 체크 원형
- **난이도**: 3단 토글 (하/중/상), 선택 시 primary 배경
- **Info**: "가상환자 정보, 딜레마 케이스, 시나리오를 순서대로 만들어요 (약 10~20초)"
- **Buttons**: 취소(ghost) + 만들기(primary)

### 6. 시나리오 상세 (`/scenarios/[id]`)

- **Purpose**: 시나리오 정보 확인, 시뮬레이션 시작, 수행 이력 열람
- **Layout**: 2컬럼 — 좌측(시나리오 카드 + 수행 이력 테이블), 우측 280px(시뮬레이션 시작 CTA)
- **시나리오 카드**: 대형 환자 아바타(100px) + 질환명/난이도/카테고리 + 시나리오 본문
- **수행 이력 테이블**: 회차, 수행일시, 상태, 점수, 보기 링크
- **우측 CTA**: "PBL 단계에서 간호 방향을 논의한 뒤, 가상 환자와 대화를 시작해요" + 제한 시간 안내 + "시뮬레이션 시작하기" 버튼

### 7. 학습 이력 (`/history`)

- **Purpose**: 전체 시뮬레이션 기록 열람
- **Layout**: 단일 컬럼 (max-width 900px)
- **통계 카드**: 총 세션 / 평균 점수 / 시나리오 수
- **테이블**: 시나리오, 수행일시, 총점, 코멘트 수, 상세 보기

### 8. 세션 결과 상세 (`/history/[sessionId]`)

- **Purpose**: 특정 세션의 평가 결과 확인
- **Layout**: 2컬럼 — 좌측(평가 게이지 + 디브리핑), 우측 260px(점수/메타/코멘트)
- **평가 게이지**: 6개 항목별 수평 바 차트 (accent 색)
- **점수 카드**: 82점 (대형 숫자) + 소요 시간/대화 턴/제한 시간
- **교수자 코멘트**: 작성자/날짜/내용 (읽기 전용)

### 9. 시뮬레이션 시작 확인 (`/sim/[sessionId]/start`)

- **Purpose**: 시뮬레이션 시작 전 시나리오/학습 목표 확인
- **Layout**: 중앙 카드 (520px, elevated)
- **Content**: 환자 아바타(80px) + 시나리오 본문 + 학습 목표 2개 (accent 배지)
- **Nav**: HFSimNav (B style — 점 + 현재 단계명 + "1 / 3")
- **Buttons**: 취소(ghost) + PBL 시작하기(primary)

### 10. PBL 대화 (`/sim/[sessionId]/pbl`)

- **Purpose**: AI 동료와 간호 방향 논의
- **Layout**: 좌측 사이드바(210px) + 우측 채팅 영역
- **좌측**:
  - 환자 정보 카드 (질환명 + 간략 시나리오)
  - PBL 턴 현황 카드 (게이지 바 + "2 / 5턴" + "완료 및 요약하기" primary 버튼)
  - "나가기" ghost 버튼 (사이드바 최하단)
- **채팅**: AI 동료 아바타(원형 dashed + "AI" 텍스트) + 말풍선(사용자: primary 배경 우측, AI: muted 배경 좌측)
- **입력**: 텍스트 입력 + 전송 버튼
- **대기 상태**: "..." 타이핑 버블 + 입력/전송 비활성화 ("AI 동료가 응답하고 있어요...")
- **5턴 소모**: 와이어프레임에 PBL Complete 모달 있음 (구현 필요)

### 11. PBL 요약 (`/sim/[sessionId]/summary`)

- **Purpose**: PBL 대화 분석 결과 확인 후 시뮬레이션 진입
- **Layout**: 중앙 (560px)
- **Content**: "의사소통 방향 요약" 제목 + AI 분석 텍스트 (자연어 단락)
- **Info note**: "이 요약은 참고용이에요. 실제 대화에서는 환자 반응에 따라 유연하게 대응하세요."
- **Buttons**: 나가기(ghost) + 시뮬레이션 시작하기(primary)

### 12. 대화 시뮬레이션 (`/sim/[sessionId]/chat`)

- **Purpose**: 가상 환자와 실시간 대화
- **Layout**: 좌측 사이드바(210px) + 우측 채팅 영역
- **좌측 (환자 상태 패널)**:
  - 활력징후 (혈압/맥박/호흡/체온 — monospace 폰트, muted 배경 박스)
  - 기타 징후 (자유 텍스트)
  - 심리적 상태 (불안/분노/우울 — 4px 높이 게이지 바)
  - "대화에 따라 실시간 갱신돼요" 안내
  - "대화 종료" danger 버튼
- **채팅 헤더**: 환자 아바타 + 이름/배지 + 시나리오 툴팁(i 아이콘, fixed 포지션) + 타이머(mono 폰트, warning 색)
- **Timer**: 10분 카운트다운, 00:00 도달 시 시간 초과 모달
- **대기 상태**: 타이핑 버블 + 입력 비활성화
- **시간 초과 모달**: 딤드 배경 + "시간이 다 됐어요" + "평가 시작하기" primary 버튼

### 13. 디브리핑 (`/sim/[sessionId]/result`)

- **Purpose**: AI 평가 결과 확인
- **Layout**: 단일 컬럼 (max-width 960px)
- **통계 카드**: 총점/소요 시간/대화 턴 3종
- **2컬럼**: 좌측(항목별 점수 게이지 6개), 우측(AI 디브리핑 텍스트)
- **Buttons**: 시나리오 목록으로(secondary) + 같은 시나리오 다시 도전(primary)

### 14. 학생 목록 (`/students`) — 교육자

- **Purpose**: 전체 학생 현황 파악
- **통계 카드**: 전체 학생/이번 주 세션/피드백 필요
- **검색**: 돋보기 아이콘 입력 (이름 또는 학번)
- **테이블**: 학번, 이름, 이메일, 세션 수, 최근 수행일, 평균, 이력 보기
- **Note**: "학생 정보는 열람만 가능해요."

### 15. 학생별 세션 이력 (`/students/[learnerId]`) — 교육자

- **Purpose**: 특정 학생의 시뮬레이션 기록 열람
- **Breadcrumb**: 학생 목록 > 김간호 (20210101)
- **통계 카드**: 총 세션/평균 점수/내 코멘트
- **테이블**: 시나리오, 수행일시, 상태, 총점, 코멘트 수, 상세 보기

### 16. 세션 상세 + 코멘트 (`/students/[learnerId]/sessions/[sessionId]`) — 교육자

- **Purpose**: 평가 결과 열람 + 코멘트 작성
- **Layout**: 2컬럼 — 좌측(평가 결과 + 대화 기록), 우측 280px(코멘트 + 세션 메타)
- **평가 결과**: 점수(accent 24px) + 6개 게이지 + 디브리핑
- **대화 기록**: PBL/시뮬레이션 탭 구분 (배지) + 말풍선 + "전체 14턴 대화"
- **코멘트**: 기존 코멘트 열람 + 텍스트 입력 + "코멘트 등록" primary 버튼
- **세션 메타**: 시작 시각/소요 시간/세션 상태/평가 도구
- **Note**: "코멘트는 추가만 가능해요. 수정·삭제는 할 수 없어요."

### 17. 로딩 화면 (공통)

- **Purpose**: AI 처리 대기 (시나리오 생성, 평가)
- **Layout**: 중앙 정렬 — 스피너(36px) + 제목 + 부제 + info note
- **Copy 예시**: "시나리오를 만들고 있어요" / "대화를 평가하고 있어요"

---

## Interactions & Behavior

### Navigation
- **Nav bar**: 52px 높이, surface 배경, 좌측 로고 + 중앙 메뉴 + 우측 사용자 정보
- **SimNav**: 시뮬레이션 중 전용 — 점(dot) 스텝 인디케이터 (B style), 현재 단계명만 표시, "N / 3" 카운터
- **Breadcrumb**: ChevronRight 아이콘 구분, 이전 단계 accent 링크

### Hover States
- **Button primary**: `#18181B` → `#27272A` (120ms ease)
- **Button secondary**: border 유지, background → surface (120ms ease)
- **Button ghost**: background → surface-muted, color → foreground (120ms ease)
- **Card**: shadow 증가, border-color → border-strong (150ms)
- **Input focus**: border → focus-ring, box-shadow `0 0 0 3px rgba(37,99,235,0.12)`
- **Input error**: border → danger, box-shadow `0 0 0 3px rgba(220,38,38,0.08)`

### Chat
- **사용자 버블**: primary 배경, 우측 정렬, border-radius `14px 14px 4px 14px`
- **상대방 버블**: muted 배경, 좌측 정렬, border-radius `14px 14px 14px 4px`
- **타이핑 버블**: 3개 dot (7px), opacity 0.35/0.6/0.85

### Toggle
- **ON**: primary 배경, 흰 원 우측
- **OFF**: border-strong 배경, 흰 원 좌측
- **Transition**: 150ms

### Timer
- **정상**: warning 색, JetBrains Mono
- **종료**: danger 색
- **위치**: 채팅 헤더 우측 끝

---

## State Management

### Auth State
```typescript
interface AuthState {
  user: { id: number; name: string; email: string; role: 'learner' | 'educator'; studentNumber?: string; } | null;
  isAuthenticated: boolean;
}
```

### Simulation Session State
```typescript
type SessionPhase = 'PBL' | 'SIMULATION' | 'EVALUATION' | 'DONE';

interface SimulationState {
  sessionId: number;
  scenarioId: number;
  currentPhase: SessionPhase;
  pblTurnCount: number;       // max 5
  timeRemaining: number;      // seconds, max 600 (10min)
  patientState: {
    vitalSigns: Record<string, string>;
    otherSigns: string;
    psychological: { anxiety: number; anger: number; depression: number; };
  };
  chatMessages: Array<{ role: 'user' | 'patient' | 'ai-peer'; content: string; }>;
  isWaitingResponse: boolean;
}
```

### Settings State
```typescript
interface SettingsState {
  ttsEnabled: boolean;
  profileImageEnabled: boolean;
}
```

---

## API Endpoints

Base URL: `/api/v1`

| Method | Path | Purpose | Screen |
|--------|------|---------|--------|
| POST | `/learners` | 학습자 등록 | 회원가입 |
| GET | `/learners/{id}` | 학습자 조회 | 프로필 |
| GET | `/documents` | 질환 문서 목록 | 시나리오 생성 (질환 선택) |
| GET | `/documents/{id}` | 질환 문서 상세 | 시나리오 생성 |
| POST | `/scenarios` | 시나리오 생성 (AI) | 시나리오 생성 |
| GET | `/scenarios/{id}` | 시나리오 조회 | 시나리오 상세 |
| POST | `/sessions` | 세션 생성 | 시뮬레이션 시작 |
| GET | `/sessions/{id}` | 세션 조회 | 시뮬레이션 상태 |
| POST | `/sessions/{id}/phase` | 단계 전환 | PBL→SIM→EVAL→DONE |
| POST | `/sessions/{id}/pbl` | PBL 대화 턴 | PBL 대화 |
| GET | `/sessions/{id}/pbl/summary` | PBL 요약 조회 | PBL 요약 |
| POST | `/sessions/{id}/pbl/summary` | PBL 요약 생성 (AI) | PBL 요약 |
| POST | `/sessions/{id}/simulate` | 시뮬레이션 대화 턴 | 대화 시뮬레이션 |
| POST | `/sessions/{id}/evaluate` | 평가 실행 (AI) | 디브리핑 |
| GET | `/sessions/{id}/evaluation` | 평가 결과 조회 | 디브리핑/세션 결과 |
| GET | `/sessions/{id}/comments` | 코멘트 목록 | 세션 상세 |
| POST | `/sessions/{id}/comments` | 코멘트 추가 | 세션 상세 (교육자) |

### API 보완 필요 사항
- `GET /learners` (학생 목록) — swagger에 없으나 교육자 화면에 필수
- `GET /learners/{id}/scenarios` — 학습자별 시나리오 목록
- `GET /learners/{id}/sessions` — 학습자별 세션 이력
- 코멘트 수정/삭제 API 없음 (PRD에서 제외됨)

---

## Component Hierarchy

```
<Layout>
  <Nav />                    # 일반 네비게이션 (학습자/교육자)
  <SimNav />                 # 시뮬레이션 중 전용 네비게이션
  <main>
    <Page />
  </main>
</Layout>

# Shared Components
<Button variant="primary|secondary|ghost|danger|accent" size="sm|md|lg" />
<Input label icon placeholder error readOnly suffix />
<Card elevated />
<Badge variant="default|success|warning|danger|accent" />
<Divider />
<Toggle on onChange />
<Spinner size />
<TableRow cells header />
<StatCard label value sub />
<Gauge label value color />
<PatientAvatar size name />
<ChatBubble role text />
<TypingBubble role />
<ScenarioTooltip />
<PatientStatePanel />
```

---

## Assets

- **Icons**: Lucide React (`lucide-react` 패키지)
  - 사용 아이콘: Mail, Lock, User, Hash, ChevronRight, LogOut, ArrowLeft, Check, AlertCircle, Loader, Mic, Image, Search, Settings, Eye, EyeOff
- **Fonts**: Inter (400/500/600/700), JetBrains Mono (400/500)
- **환자 아바타**: 색상 기반 초기 플레이스홀더 (이름 해시 → 파스텔 색상 선택) — 설정에서 AI 이미지 생성 토글 가능

---

## Files

이 핸드오프 패키지에 포함된 디자인 파일:

| File | Description |
|------|-------------|
| `Hi-Fi Design.html` | 전체 Hi-Fi 디자인 캔버스 (모든 화면 포함) |
| `Wireframe.html` | 와이어프레임 캔버스 (구조 참조용) |
| `hifi/components.jsx` | 공통 UI 컴포넌트 (Button, Input, Card 등) |
| `hifi/screens-common.jsx` | 인증/프로필/로딩 화면 |
| `hifi/screens-learner.jsx` | 학습자 화면 (시나리오 목록/상세/이력) |
| `hifi/screens-simulation.jsx` | 시뮬레이션 플로우 전체 |
| `hifi/screens-educator.jsx` | 교육자 화면 (학생 목록/이력/코멘트) |
| `uploads/DESIGN.md` | 디자인 시스템 정의 |
| `uploads/swagger.json` | API 스펙 |
| `uploads/prd.md` | 제품 요구사항 문서 |
| `uploads/flow.md` | 시뮬레이션 AI 워크플로우 |
| `uploads/database.md` | DB 스키마 설계 |

---

## Implementation Notes

1. **시뮬레이션은 중단 불가**: 한 번 시작한 시뮬레이션은 반드시 종료해야 합니다 (PBL에서 "나가기"는 세션 자체를 폐기하는 것)
2. **PBL 턴 제한**: 최대 5턴. 5턴 소모 시 자동으로 요약 화면으로 전환
3. **대화 시간 제한**: 10분. 타이머 종료 시 자동으로 평가 단계로 전환
4. **평가는 1회**: 하나의 세션에 대한 평가는 단 한 번만 가능 (재평가 불가)
5. **교육자 권한**: 열람 + 코멘트 추가만 가능 (학생/시나리오 추가·수정·삭제 불가)
6. **심리적 상태 갱신**: 대화 시뮬레이션 중 환자의 심리 상태는 매 턴마다 API 응답으로 갱신
