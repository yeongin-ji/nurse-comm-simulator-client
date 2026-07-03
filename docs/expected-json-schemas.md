# Client가 기대하는 JSON 내부 스키마

서버 swagger에서 `any`로 정의된 필드들에 대해, 클라이언트가 실제로 파싱하는 구조입니다.
서버 응답이 이 형식을 따라야 클라이언트 UI가 정상 동작합니다.

> **현재 서버 구조 → 클라이언트 기대 구조** 순서로 불일치를 표기합니다.

---

## 1. `item_scores` (EvaluationResultResponse)

**사용처**: 디브리핑 화면, 세션 결과 상세

### 현재 서버

```json
[
  { "item_id": 1, "item_name": "환자 인사", "score": 3, "reason": "..." },
  ...
]
```

### 클라이언트 기대

```json
{
  "items": [
    { "label": "환자 맞이 및 자기소개", "value": 1, "reason": "첫 인사를 건넸으나 자기소개는 없었음" },
    { "label": "개방형 질문 사용", "value": 0, "reason": "..." },
    { "label": "쉬운 언어로 설명", "value": null, "reason": "해당 단계까지 대화가 진행되지 않음" },
    ...
  ],
  "total": 78,
  "duration_seconds": 402,
  "turns": 14
}
```

### 필드 설명

| 필드 | 타입 | 설명 |
|---|---|---|
| `items` | `Array<{ label: string, value: number \| null, reason?: string \| null }>` | 평가 항목별 점수. `label`은 항목 이름, `value`는 도구 스케일 내 점수 (`null` = 해당 없음, `0` = 미수행), `reason`은 항목별 평가 사유 |
| `total` | `number` | 전체 평균 점수 |
| `duration_seconds` | `number` | 시뮬레이션 소요 시간 (초) |
| `turns` | `number` | 총 대화 턴 수 |

### 차이점
- 서버: 초기에는 배열 직접 반환(`item_id`/`item_name`/`score`/`reason`)이었으나, 현재는 클라이언트 기대 구조(`{items, total, duration_seconds, turns}`)로 반영됨. `items[].reason`도 서버에서 포함해 내려줌 (2026-07 반영)
- 클라이언트: `reason`은 옵셔널로 파싱하므로 `reason`이 없는 과거 세션 데이터도 정상 렌더링됨 (사유 텍스트만 생략)

---

## 2. `medical_record` (ScenarioResponse)

**사용처**: 시나리오 상세 페이지 (환자 이름, 성별, 나이, 난이도 표시)

### 현재 서버

```json
{
  "personal_info": { "name": "OOO", "age": "47", "gender": "M" },
  "history": { "underlying_disease": "...", "medications": "...", ... },
  "symptom_state": { "chief_complaint": "...", ... }
}
```

### 클라이언트 기대

```json
{
  "name": "OOO",
  "age": 47,
  "sex": "M",
  "difficulty": "중"
}
```

### 필드 설명

| 필드 | 타입 | 설명 |
|---|---|---|
| `name` | `string` | 환자 이름 (없으면 "OOO" 기본값 사용) |
| `age` | `number` | 환자 나이 (숫자, UI에서 `${age}세`로 표시) |
| `sex` | `string` | 성별 ("M" / "F") |
| `difficulty` | `string` | 난이도 ("상" / "중" / "하") |

### 차이점
- 서버: 중첩 구조 (`personal_info.name`), `gender` 키, `age`가 string
- 클라이언트: flat 구조 (`name`), `sex` 키, `age`가 number, `difficulty` 포함

### 제안
서버의 기존 중첩 구조를 유지하되, 클라이언트가 필요한 flat 필드를 **최상위에 추가**하는 방식도 가능:
```json
{
  "name": "OOO",
  "age": 47,
  "sex": "M",
  "difficulty": "중",
  "personal_info": { ... },
  "history": { ... },
  "symptom_state": { ... }
}
```

---

## 3. `current_state` (SimulateTurnResponse)

**사용처**: 대화 시뮬레이션 좌측 환자 상태 패널 (활력징후 + 심리적 상태 게이지)

### 현재 서버

```json
{
  "environmental_state": {
    "place": "병실",
    "action": "누워있음"
  },
  "psychological_state": {
    "anxiety": 5,
    "anger": 2,
    "sadness": 3
  }
}
```

### 클라이언트 기대

```json
{
  "vital_signs": {
    "blood_pressure": "138/88",
    "pulse": "102 bpm",
    "respiration": "24회/분",
    "temperature": "37.2℃"
  },
  "psychological": {
    "anxiety": 72,
    "anger": 55,
    "depression": 20
  }
}
```

### 필드 설명

| 필드 | 타입 | 설명 |
|---|---|---|
| `vital_signs` | `Record<string, string>` | 활력징후 key-value. key는 `blood_pressure`, `pulse`, `respiration`, `temperature` 사용 시 한국어 레이블 자동 매핑 |
| `psychological` | `{ anxiety: number, anger: number, depression: number }` | 심리 상태 수치 (0-100 스케일, 게이지 바로 렌더링) |

### 차이점
- 서버: `environmental_state` (장소/행동), `psychological_state` 키, `sadness` 필드
- 클라이언트: `vital_signs` (활력징후 수치), `psychological` 키, `depression` 필드
- 서버의 `place`/`action`은 클라이언트에서 사용하지 않음
- 활력징후 데이터가 서버에 없음 (가장 큰 gap)

---

## 4. `initial_state` (ScenarioCreateResponse / ScenarioDetailResponse)

**사용처**: 시나리오 상세 페이지 환자 초기 상태, 시뮬레이션 시작 시 초기값

### 현재 서버

```json
{
  "environmental_state": {
    "place": "병실",
    "action": "누워있음"
  },
  "psychological_state": {
    "anxiety": 5,
    "anger": 2,
    "sadness": 3
  }
}
```

### 클라이언트 기대

```json
{
  "environmental_state": {
    "vital_signs": {
      "blood_pressure": "138/88",
      "pulse": "102 bpm",
      "respiration": "24회/분",
      "temperature": "37.2℃"
    },
    "other_signs": "호흡 시 천명음(wheezing) 청진됨."
  },
  "psychological_state": {
    "anxiety": 72,
    "anger": 55,
    "depression": 20
  }
}
```

### 필드 설명

| 필드 | 타입 | 설명 |
|---|---|---|
| `environmental_state.vital_signs` | `Record<string, string>` | 초기 활력징후. key 권장: `blood_pressure`, `pulse`, `respiration`, `temperature` |
| `environmental_state.other_signs` | `string` | 기타 신체 징후 (자유 텍스트) |
| `psychological_state.anxiety` | `number` | 불안 수치 (0-100) |
| `psychological_state.anger` | `number` | 분노 수치 (0-100) |
| `psychological_state.depression` | `number` | 우울 수치 (0-100) |

### 차이점
- `environmental_state` 내부: 서버는 `place`/`action`, 클라이언트는 `vital_signs`/`other_signs`
- `psychological_state`: 서버는 `sadness`, 클라이언트는 `depression`
- 수치 스케일: 서버는 낮은 범위(1-10?), 클라이언트는 0-100 기대

---

## 5. `categories` (PBLSummaryResponse)

**사용처**: PBL 요약 화면 (단일 텍스트 블록으로 렌더링)

### 현재 서버

```json
[
  {
    "name": "호흡 관리",
    "items": ["호흡양상 관찰", "기관내 흡인 실시"]
  },
  {
    "name": "감염 관리",
    "items": ["항생제 투여"]
  }
]
```

### 클라이언트 기대

```json
{
  "text": "환자의 호흡곤란에 대해 단계적 접근이 필요합니다. 먼저 신뢰를 형성한 후..."
}
```

또는 단순 문자열:

```json
"환자의 호흡곤란에 대해 단계적 접근이 필요합니다..."
```

### 필드 설명

클라이언트의 `extractSummaryText()` 함수가 다음 순서로 파싱을 시도합니다:
1. `categories`가 `string`이면 그대로 사용
2. `categories`가 `{ text: string }` 객체이면 `.text` 추출
3. 그 외는 빈 문자열 반환

### 차이점
- 서버: 구조화된 카테고리 배열 (`[{name, items}]`)
- 클라이언트: 자연어 텍스트 한 덩어리
- 서버의 배열 구조는 클라이언트에서 아예 파싱 불가 → 빈 문자열이 됨

### 제안
두 가지 방식 중 택일:
- **A**: `categories`를 `{ text: "...", items: [...] }` 형태로 반환 (text에 자연어 요약 포함)
- **B**: 별도 `summary_text` 필드를 PBLSummaryResponse에 추가

---

## 6. `dilemma` (ScenarioResponse)

**사용처**: 현재 클라이언트에서 직접 파싱하지 않음 (mock에서 `{ summary: "..." }`로 설정하지만 UI에서 미사용)

### 현재 서버

```json
{
  "case": "autonomy_vs_beneficence",
  "factor": ["autonomy", "beneficence"],
  "chief_complaint_quote": "...",
  "nursing_rationale": "..."
}
```

### 클라이언트
현재 사용하지 않으므로 **변경 불필요**. 향후 필요 시 협의.

---

## 7. `disease_details` (DocumentResponse)

**사용처**: 현재 클라이언트에서 직접 파싱하지 않음

### 현재 서버 (시드 데이터)

```json
{
  "증상": "- 발열 및 오한\n- 호흡수 증가...",
  "간호중재": "- 호흡양상 관찰..."
}
```

### 클라이언트
현재 사용하지 않으므로 **변경 불필요**.

---

## 요약: 서버 수정 필요 항목

| 우선순위 | 필드 | 변경 내용 |
|---|---|---|
| **P0** | `item_scores` | 배열 → `{ items, total, duration_seconds, turns }` 객체로 감싸기. `item_name`/`score` → `label`/`value` |
| **P0** | `current_state` | `environmental_state.{place,action}` → `vital_signs` Record + `psychological.sadness` → `depression` |
| **P0** | `initial_state` | 동일하게 `vital_signs`/`other_signs` 구조 + `sadness` → `depression` |
| **P1** | `medical_record` | 중첩 구조 → flat (`name`, `age`(number), `sex`, `difficulty`) |
| **P1** | `categories` | 배열 → `{ text: "..." }` 또는 `string` (자연어 요약) |
| - | `dilemma` | 변경 불필요 |
| - | `disease_details` | 변경 불필요 |
