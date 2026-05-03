---
name: Minimal Clean
description: Vercel/Linear 스타일의 미니멀·에어리 디자인 시스템. 에이전트가 즉시 꺼내 쓸 수 있는 라이트 베이스.
colors:
  background: "#FFFFFF"
  surface: "#FAFAFA"
  surface-muted: "#F4F4F5"
  surface-elevated: "#FFFFFF"
  border: "#E4E4E7"
  border-strong: "#D4D4D8"
  foreground: "#09090B"
  foreground-muted: "#52525B"
  foreground-subtle: "#A1A1AA"
  primary: "#18181B"
  on-primary: "#FAFAFA"
  accent: "#2563EB"
  on-accent: "#FFFFFF"
  success: "#16A34A"
  warning: "#F59E0B"
  danger: "#DC2626"
  focus-ring: "#2563EB"
typography:
  display-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 56px
    fontWeight: "600"
    lineHeight: 60px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: "500"
    lineHeight: 28px
  body-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-md:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
rounded:
  sm: 4px
  DEFAULT: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  container-padding: 24px
  card-gap: 16px
  section-margin: 48px
  page-max-width: 1120px
elevation:
  shadow-xs: "0 1px 1px 0 rgba(0, 0, 0, 0.04)"
  shadow-sm: "0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 1px -1px rgba(0, 0, 0, 0.04)"
  shadow-md: "0 4px 8px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)"
  shadow-lg: "0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.DEFAULT}"
    height: 36px
    padding: 0 16px
  button-primary-hover:
    backgroundColor: "#27272A"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.DEFAULT}"
    height: 36px
    padding: 0 16px
    border: "1px solid {colors.border}"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.DEFAULT}"
    height: 36px
    padding: 0 12px
  card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 24px
    border: "1px solid {colors.border}"
    shadow: "{elevation.shadow-xs}"
  card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.lg}"
    padding: 24px
    shadow: "{elevation.shadow-md}"
  input-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.DEFAULT}"
    height: 36px
    padding: 0 12px
    border: "1px solid {colors.border}"
  input-field-focus:
    borderColor: "{colors.focus-ring}"
  badge-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground-muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 2px 10px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  link:
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    underline: "1px solid {colors.border-strong}"
  code-inline:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.mono-md}"
    rounded: "{rounded.sm}"
    padding: 1px 6px
---

## Overview

Minimal Clean은 정보와 액션 자체에 시선을 집중시키기 위해 **여백**과 **타이포그래피**로만 계층을 만드는 시스템이다. 순백 배경 위에 얇은 보더와 미세한 그림자만 허용하며, 색은 브랜드 포인트 한 가지(`{colors.accent}`)와 피드백 시그널(`success`/`warning`/`danger`)로 제한한다. Vercel, Linear, Framer 도큐멘트 사이트에서 반복적으로 검증된 패턴을 압축했다.

해커톤 맥락에서의 장점: (1) 어떤 브랜드 컬러가 와도 충돌하지 않고, (2) 텍스트 가독성이 높아 데모 중 투영·캡처 시에도 선명하다.

## Colors

- **중립 스케일**은 Zinc 계열 8단(`background` → `foreground`). 모든 구획 분리는 `border`와 `surface-muted`로만 처리하고 면적 색상 블록은 피한다.
- **포인트 색**은 `{colors.accent}` 단 1종. 링크, 포커스 링, 프라이머리 CTA 강조 중 **한 용도에만** 배정한다.
- **피드백 색**(`success`, `warning`, `danger`)은 배지·토스트·폼 에러 표시에만 쓰고, 본문 텍스트 색으로는 쓰지 않는다.
- 다크 모드가 필요하면 `background`↔`foreground`를 swap하고 `border`를 `#27272A`, `surface`를 `#0A0A0B`로 맞춘다.

## Typography

- 본문은 Inter, 코드는 JetBrains Mono 고정. 다른 폰트 섞지 말 것.
- 디스플레이·헤드라인에는 `letterSpacing`을 음수로 살짝 조여 "타이트하지만 호흡 있는" 느낌을 유지.
- 본문 크기 기본값은 `body-md`(14px). 문서성 콘텐츠에만 `body-lg`(16px).
- 캡션/라벨 대문자화는 피하고 `label-sm`으로 웨이트와 자간만 조절.

## Layout

- 베이스 그리드 단위는 **4px**(`{spacing.unit}`). 모든 간격은 4의 배수.
- 컨테이너 최대 폭 1120px, 모바일 사이드 padding 24px.
- 카드 간 간격은 16px, 섹션 간 margin은 48px.
- 12컬럼 그리드를 기본으로 하되, 데모성 페이지에선 단일 column + max-width 640px 권장.

## Elevation & Depth

- 그림자는 **"있는지 없는지 헷갈릴 정도"**가 디폴트. `shadow-xs`·`shadow-sm`을 표준으로 사용.
- `shadow-md`·`shadow-lg`는 팝오버·모달·드롭다운 같은 **떠 있는 레이어**에만.
- 절대 색조 있는 그림자(`rgba(blue, 0.2)` 등)를 사용하지 말 것. 블러가 번져 "낡은 UI" 느낌이 난다.

## Shapes

- `rounded.DEFAULT`(6px)가 기본. 버튼, 인풋, 뱃지 모두 동일값.
- 카드 컨테이너만 `rounded.md`(8px)로 살짝 키워 레이어를 분리.
- 아바타/프로필 이미지, pill 뱃지만 `rounded.full`.
- 각진 box(0px)는 금지 — Brutal 시스템과 혼동됨.

## Components

| 컴포넌트 | 용도 | 핵심 규칙 |
|---------|------|----------|
| `button-primary` | 페이지당 1개 주요 CTA | 검정 배경 흰 텍스트, 36px 높이 |
| `button-secondary` | 보조 CTA, 폼 submit 외 액션 | 흰 배경 + 얇은 테두리 |
| `button-ghost` | 탐색·메뉴 내부 액션 | 배경 없음, hover 시 surface |
| `card` | 정보 그룹핑 단위 | 1px border, shadow 없음 또는 xs |
| `input-field` | 폼, 검색 | height 36px, border 1px |
| `badge-muted` | 상태·카운트 표시 | pill + surface-muted |
| `divider` | 섹션 구분 | 1px border 색만 사용 |

## Do's and Don'ts

- Do: 흰 여백을 "더 많이" 주는 쪽으로 결정. 꽉 찬 레이아웃은 이 시스템과 맞지 않다.
- Do: 한 페이지에 **primary 버튼은 1개**, accent 컬러는 **1개 용도**로 제한.
- Do: 포커스 링은 2px `{colors.focus-ring}` + 2px 배경 offset 으로 명확히.
- Don't: 그라디언트 배경, 컬러 그림자, 3개 이상의 굵은 웨이트 혼용.
- Don't: rounded를 컴포넌트마다 다르게 쓰지 말 것. 6px → 8px 2단계로만.
- Don't: 일러스트·이모지 대체로 면적 색상을 채우지 말 것. 아이콘은 1.5px stroke 선 아이콘(Lucide) 사용.
