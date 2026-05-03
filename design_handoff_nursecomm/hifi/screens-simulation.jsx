
// ─── Hi-Fi Simulation Flow Screens ──────────────────────────────────────────

// ── Shared: Sim Nav (B style — dot + current label) ─────────────────────────
const HFSimNav = ({ current = 0 }) => {
  const steps = ['PBL', '대화 시뮬레이션', '디브리핑'];
  return (
    <div style={{
      height: 52, background: HF.surface,
      borderBottom: `1px solid ${HF.border}`,
      display: 'flex', alignItems: 'center', padding: '0 24px',
      justifyContent: 'space-between',
    }}>
      <HFText size={15} weight={600} style={{ letterSpacing: '-0.02em' }}>NurseComm</HFText>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 20, height: 1, background: i <= current ? HF.fg : HF.border }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 8, height: 8, borderRadius: 9999, flexShrink: 0,
                background: i < current ? HF.success : i === current ? HF.fg : HF.muted,
                border: `1.5px solid ${i < current ? HF.success : i === current ? HF.fg : HF.borderStrong}`,
              }} />
              {i === current && <HFText size={13} weight={600}>{s}</HFText>}
            </div>
          </React.Fragment>
        ))}
        <HFText size={12} subtle style={{ marginLeft: 6 }}>{current + 1} / {steps.length}</HFText>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 9999,
          background: HF.muted, border: `1px solid ${HF.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LucideIcon d={ICONS.user} size={14} color={HF.fgMuted} />
        </div>
        <HFText size={13} weight={500}>홍길동</HFText>
      </div>
    </div>
  );
};

// ── Shared: Chat Bubble ─────────────────────────────────────────────────────
const HFBubble = ({ role = 'user', text }) => {
  const isUser = role === 'user';
  const label = isUser ? '간호학생' : role === 'ai-peer' ? 'AI 동료' : '가상 환자';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 4 }}>
      <HFText size={11} subtle>{label}</HFText>
      <div style={{
        maxWidth: '78%', padding: '10px 14px',
        background: isUser ? HF.primary : HF.muted,
        color: isUser ? HF.onPrimary : HF.fg,
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        fontSize: 13, fontFamily: HF.font, lineHeight: '20px',
      }}>{text}</div>
    </div>
  );
};

// ── Shared: Typing Bubble ───────────────────────────────────────────────────
const HFTypingBubble = ({ role = 'patient' }) => {
  const label = role === 'ai-peer' ? 'AI 동료' : '가상 환자';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
      <HFText size={11} subtle>{label}</HFText>
      <div style={{
        background: HF.muted, borderRadius: '14px 14px 14px 4px',
        padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: HF.fgSubtle, opacity: 0.35 + i * 0.25,
          }} />
        ))}
      </div>
    </div>
  );
};

// ── Shared: Scenario Tooltip ────────────────────────────────────────────────
const HFScenarioTooltip = () => {
  const [show, setShow] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const ref = React.useRef(null);
  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: Math.max(8, rect.right - 300) });
    }
    setShow(true);
  };
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 9999,
        border: `1px solid ${HF.border}`, background: HF.muted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
      }}>
        <HFText size={11} weight={600} style={{ color: HF.fgMuted, lineHeight: 1 }}>i</HFText>
      </div>
      {show && (
        <div style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          width: 300, background: HF.bg,
          border: `1px solid ${HF.border}`, borderRadius: HF.radiusMd,
          padding: 14, boxShadow: '0 4px 12px -4px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none',
        }}>
          <HFText size={12} weight={500}>시나리오</HFText>
          <HFText size={12} muted style={{ lineHeight: '18px' }}>
            COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡과 복식 호흡을 교육하려 합니다. 하지만 환자는 교육을 완강히 거부합니다.
          </HFText>
        </div>
      )}
    </div>
  );
};

// ── Shared: Patient state sidebar ───────────────────────────────────────────
const HFPatientStatePanel = ({ showEndBtn = true }) => (
  <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
    <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>환자 현재 상태</HFText>

      {/* Vital signs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 10px', background: HF.muted, borderRadius: HF.radius }}>
        <HFText size={12} weight={500} style={{ marginBottom: 2 }}>활력징후</HFText>
        {[
          { label: '혈압', value: '138/88' },
          { label: '맥박', value: '102 bpm' },
          { label: '호흡', value: '24회/분' },
          { label: '체온', value: '37.2℃' },
        ].map((v, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <HFText size={11} muted>{v.label}</HFText>
            <HFText size={11} weight={500} style={{ fontFamily: HF.mono }}>{v.value}</HFText>
          </div>
        ))}
      </div>

      {/* Other signs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <HFText size={11} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>기타 징후</HFText>
        <HFText size={12} muted style={{ lineHeight: '18px' }}>
          호흡 시 천명음(wheezing) 청진됨. 입술 오므리기 호흡 자세 관찰.
        </HFText>
      </div>

      <HFDivider />

      {/* Psychological state */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <HFText size={11} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>심리적 상태</HFText>
        {[
          { label: '불안', value: 72, color: HF.danger },
          { label: '분노', value: 55, color: HF.warning },
          { label: '우울', value: 20, color: HF.fgSubtle },
        ].map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HFText size={11} muted style={{ width: 26, flexShrink: 0 }}>{g.label}</HFText>
            <div style={{ flex: 1, height: 4, background: HF.muted, borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: g.value + '%', background: g.color, borderRadius: 9999 }} />
            </div>
            <HFText size={11} weight={500} style={{ width: 30, textAlign: 'right', flexShrink: 0 }}>{g.value}%</HFText>
          </div>
        ))}
        <HFText size={10} subtle>대화에 따라 실시간 갱신돼요</HFText>
      </div>
    </HFCard>
    {showEndBtn && <HFButton label="대화 종료" variant="danger" full />}
  </div>
);

// ── S1: 시뮬레이션 시작 확인 ────────────────────────────────────────────────
const HFScreenSimStart = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={0} />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <HFCard elevated style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 20, padding: 28 }}>
        {/* Header with avatar */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <HFPatientAvatar size={80} name="OOO" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <HFText size={18} weight={600} style={{ display: 'block', marginBottom: 3 }}>시뮬레이션을 시작할게요</HFText>
              <HFText size={14} muted>COPD · OOO (M/47)</HFText>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <HFBadge label="난이도 중" />
              <HFBadge label="호흡기계 > 폐쇄성폐질환" />
            </div>
            <HFDivider />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LucideIcon d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" size={14} color={HF.fgSubtle} />
              <HFText size={12} muted>PBL: 최대 5턴 · 대화: 10분 제한</HFText>
            </div>
          </div>
        </div>

        <HFDivider />

        {/* Scenario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>시나리오</HFText>
          <HFText size={14} style={{ lineHeight: '24px' }}>
            COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡과 복식 호흡을 교육하려 합니다. 하지만 환자는 "숨차 죽겠는데 자꾸 뭘 시키냐"며 교육을 완강히 거부합니다.
          </HFText>
        </div>

        <HFDivider />

        {/* Learning objectives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>학습 목표</HFText>
          {[
            '딜레마 상황에서 환자에게 제공할 간호에 대해 의사결정을 내릴 수 있다.',
            '의사결정을 바탕으로 환자와 효과적으로 의사소통 할 수 있다.',
          ].map((obj, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <HFBadge label={`${i + 1}`} variant="accent" />
              <HFText size={13} muted style={{ lineHeight: '20px', paddingTop: 1 }}>{obj}</HFText>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <HFButton label="취소" variant="ghost" />
          <HFButton label="PBL 시작하기" variant="primary" />
        </div>
      </HFCard>
    </div>
  </div>
);

// ── S2: PBL 대화 ────────────────────────────────────────────────────────────
const HFScreenPBL = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={0} />
    <div style={{ flex: 1, display: 'flex', padding: '16px 24px', gap: 16, overflow: 'hidden' }}>
      {/* Left sidebar */}
      <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
          <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>환자 정보</HFText>
          <HFText size={13} weight={500}>COPD · OOO (M/47)</HFText>
          <HFDivider />
          <HFText size={12} muted style={{ lineHeight: '18px' }}>
            COPD 환자인 OOO님은 호흡곤란을 호소하며 교육을 완강히 거부합니다.
          </HFText>
        </HFCard>
        <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
          <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>PBL 턴 현황</HFText>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <HFText size={12} muted>진행</HFText>
            <HFText size={12} weight={500}>2 / 5턴</HFText>
          </div>
          <div style={{ height: 6, background: HF.muted, borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '40%', background: HF.fg, borderRadius: 9999 }} />
          </div>
          <HFDivider />
          <HFButton label="완료 및 요약하기" variant="primary" size="sm" full />
        </HFCard>
        <HFButton label="나가기" variant="ghost" size="sm" full />
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <HFCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9999,
              background: HF.muted, border: `1px dashed ${HF.borderStrong}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HFText size={10} style={{ color: HF.fgSubtle }}>AI</HFText>
            </div>
            <HFText size={14} weight={500}>AI 동료</HFText>
            <HFBadge label="의사소통 방향 논의" />
          </div>
          <HFDivider />
          <HFBubble role="ai-peer" text="안녕하세요! COPD 환자를 만나기 전에 의사소통 방향을 함께 논의해 봐요. 어떤 목표를 세우고 싶으세요?" />
          <HFBubble role="user" text="환자의 불안을 줄이고, 호흡 교육에 대한 거부감을 낮추는 데 집중하고 싶어요." />
          <HFBubble role="ai-peer" text="좋은 접근이에요. 환자의 감정을 먼저 공감한 뒤 교육을 시도하면 거부감이 줄어들 수 있어요. 구체적으로 어떤 방식을 생각하고 계세요?" />
        </HFCard>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, height: 40, padding: '0 14px',
            border: `1px solid ${HF.border}`, borderRadius: HF.radius,
            background: HF.bg, display: 'flex', alignItems: 'center',
          }}>
            <HFText size={14} subtle>AI 동료에게 의사소통 계획을 이야기하세요...</HFText>
          </div>
          <HFButton label="전송" variant="primary" />
        </div>
      </div>
    </div>
  </div>
);

// ── S2-B: PBL — AI 응답 대기 ────────────────────────────────────────────────
const HFScreenPBLWaiting = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={0} />
    <div style={{ flex: 1, display: 'flex', padding: '16px 24px', gap: 16, overflow: 'hidden' }}>
      <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
          <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>환자 정보</HFText>
          <HFText size={13} weight={500}>COPD · OOO (M/47)</HFText>
          <HFDivider />
          <HFText size={12} muted style={{ lineHeight: '18px' }}>COPD 환자인 OOO님은 호흡곤란을 호소하며 교육을 완강히 거부합니다.</HFText>
        </HFCard>
        <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
          <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>PBL 턴 현황</HFText>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <HFText size={12} muted>진행</HFText>
            <HFText size={12} weight={500}>3 / 5턴</HFText>
          </div>
          <div style={{ height: 6, background: HF.muted, borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '60%', background: HF.fg, borderRadius: 9999 }} />
          </div>
          <HFDivider />
          <HFButton label="완료 및 요약하기" variant="primary" size="sm" full />
        </HFCard>
        <HFButton label="나가기" variant="ghost" size="sm" full />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <HFCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9999, background: HF.muted, border: `1px dashed ${HF.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HFText size={10} style={{ color: HF.fgSubtle }}>AI</HFText>
            </div>
            <HFText size={14} weight={500}>AI 동료</HFText>
            <HFBadge label="의사소통 방향 논의" />
          </div>
          <HFDivider />
          <HFBubble role="ai-peer" text="안녕하세요! COPD 환자를 만나기 전에 의사소통 방향을 함께 논의해 봐요." />
          <HFBubble role="user" text="환자의 불안을 줄이고, 호흡 교육에 대한 거부감을 낮추는 데 집중하고 싶어요." />
          <HFBubble role="ai-peer" text="좋은 접근이에요. 환자의 감정을 먼저 공감한 뒤 교육을 시도하면 거부감이 줄어들 수 있어요." />
          <HFBubble role="user" text="공감적 경청을 먼저 활용하고, 개방형 질문으로 환자의 이야기를 이끌어내 보겠습니다." />
          <HFTypingBubble role="ai-peer" />
        </HFCard>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, height: 40, padding: '0 14px', border: `1px solid ${HF.border}`, borderRadius: HF.radius, background: HF.muted, display: 'flex', alignItems: 'center', opacity: 0.5 }}>
            <HFText size={14} subtle>AI 동료가 응답하고 있어요...</HFText>
          </div>
          <HFButton label="전송" variant="primary" disabled />
        </div>
      </div>
    </div>
  </div>
);

// ── S3: PBL 요약 ────────────────────────────────────────────────────────────
const HFScreenPBLSummary = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={0} />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <HFText as="h2" size={18} weight={600} style={{ display: 'block', marginBottom: 6 }}>의사소통 방향 요약</HFText>
          <HFText size={14} muted style={{ display: 'block' }}>PBL 대화를 분석하여 정리했어요. 확인 후 시뮬레이션을 시작하세요.</HFText>
        </div>

        <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HFText size={13} muted style={{ lineHeight: '20px' }}>
            PBL 대화를 바탕으로 아래와 같은 의사소통 방향이 도출되었어요.
          </HFText>
          <HFDivider />
          <HFText size={14} style={{ lineHeight: '26px', whiteSpace: 'pre-line' }}>
{`환자의 호흡 상태를 안정시키기 위해 산소 포화도를 지속적으로 모니터링하고, 반좌위를 유지하도록 돕는 것이 필요해요.

환자는 현재 높은 불안감과 분노감을 보이고 있으므로, 공감적 경청과 안심 제공을 통해 심리적 안정을 도모해야 해요. 신뢰 관계가 형성되어야 이후 교육적 중재가 효과적으로 이루어질 수 있어요.

환자가 안정된 이후에는 흡입기 사용법과 증상 악화 시 대처법에 대해 교육하는 것이 좋아요.`}
          </HFText>
        </HFCard>

        <div style={{
          background: HF.muted, borderRadius: HF.radius, padding: '10px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <LucideIcon d={ICONS.alertCircle} size={14} color={HF.fgSubtle} style={{ marginTop: 2 }} />
          <HFText size={12} muted style={{ lineHeight: '18px' }}>이 요약은 참고용이에요. 실제 대화에서는 환자 반응에 따라 유연하게 대응하세요.</HFText>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <HFButton label="나가기" variant="ghost" />
          <HFButton label="시뮬레이션 시작하기" variant="primary" />
        </div>
      </div>
    </div>
  </div>
);

// ── S4: 대화 시뮬레이션 ─────────────────────────────────────────────────────
const HFScreenSimulation = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={1} />
    <div style={{ flex: 1, display: 'flex', padding: '16px 24px', gap: 16, overflow: 'hidden' }}>
      <HFPatientStatePanel />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <HFCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <HFPatientAvatar size={28} name="OOO" style={{ borderRadius: 9999, height: 28 }} />
            <HFText size={14} weight={500}>가상 환자</HFText>
            <HFBadge label="COPD · OOO (M/47)" />
            <HFScenarioTooltip />
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <HFText size={18} weight={600} style={{ color: HF.warning, letterSpacing: '-0.02em', fontFamily: HF.mono }}>07:24</HFText>
              <HFText size={12} muted>/ 10:00</HFText>
            </div>
          </div>
          <HFDivider />
          <HFBubble role="patient" text="(거칠게 숨을 몰아쉬며) 뭐가 필요해요? 어차피 나한테 관심 없잖아요..." />
          <HFBubble role="user" text="안녕하세요, 저는 오늘 담당 간호학생이에요. 지금 많이 힘드시죠? 먼저 호흡부터 천천히 안정시켜 드릴게요." />
          <HFBubble role="patient" text="(시선을 잠깐 돌리며) ...네, 숨쉬기가 너무 힘들어요." />
        </HFCard>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, height: 40, padding: '0 14px', border: `1px solid ${HF.border}`, borderRadius: HF.radius, background: HF.bg, display: 'flex', alignItems: 'center' }}>
            <HFText size={14} subtle>환자에게 말을 건네세요...</HFText>
          </div>
          <HFButton label="전송" variant="primary" />
        </div>
      </div>
    </div>
  </div>
);

// ── S4-B: 가상 환자 응답 대기 ───────────────────────────────────────────────
const HFScreenSimWaiting = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={1} />
    <div style={{ flex: 1, display: 'flex', padding: '16px 24px', gap: 16, overflow: 'hidden' }}>
      <HFPatientStatePanel />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <HFCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <HFPatientAvatar size={28} name="OOO" style={{ borderRadius: 9999, height: 28 }} />
            <HFText size={14} weight={500}>가상 환자</HFText>
            <HFBadge label="COPD · OOO (M/47)" />
            <HFScenarioTooltip />
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <HFText size={18} weight={600} style={{ color: HF.warning, fontFamily: HF.mono }}>07:24</HFText>
              <HFText size={12} muted>/ 10:00</HFText>
            </div>
          </div>
          <HFDivider />
          <HFBubble role="patient" text="(거칠게 숨을 몰아쉬며) 뭐가 필요해요?" />
          <HFBubble role="user" text="안녕하세요, 저는 담당 간호학생이에요. 지금 많이 힘드시죠?" />
          <HFBubble role="patient" text="...네, 숨쉬기가 너무 힘들어요." />
          <HFBubble role="user" text="지금 가장 불편한 부분이 어디세요? 천천히 말씀해 주셔도 돼요." />
          <HFTypingBubble role="patient" />
        </HFCard>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, height: 40, padding: '0 14px', border: `1px solid ${HF.border}`, borderRadius: HF.radius, background: HF.muted, display: 'flex', alignItems: 'center', opacity: 0.5 }}>
            <HFText size={14} subtle>환자가 응답하고 있어요...</HFText>
          </div>
          <HFButton label="전송" variant="primary" disabled />
        </div>
      </div>
    </div>
  </div>
);

// ── S4-C: 제한 시간 초과 모달 ───────────────────────────────────────────────
const HFScreenSimTimeout = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={1} />
    <div style={{ flex: 1, display: 'flex', padding: '16px 24px', gap: 16, overflow: 'hidden', position: 'relative' }}>
      {/* Dimmed background */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.4)', zIndex: 10, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HFCard elevated style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 18, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9999, background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LucideIcon d={ICONS.alertCircle} size={20} color={HF.danger} />
            </div>
            <div>
              <HFText size={16} weight={600} style={{ display: 'block' }}>시간이 다 됐어요</HFText>
              <HFText size={13} muted>10:00 / 10:00</HFText>
            </div>
          </div>
          <HFDivider />
          <HFText size={14} muted style={{ lineHeight: '22px' }}>
            대화 시뮬레이션 시간이 종료됐어요. 지금까지의 대화를 바탕으로 평가를 진행할게요.
          </HFText>
          <div style={{ background: HF.muted, borderRadius: HF.radius, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <LucideIcon d={ICONS.alertCircle} size={14} color={HF.fgSubtle} style={{ marginTop: 2 }} />
            <HFText size={12} muted>평가가 시작되면 대화 내용을 수정할 수 없어요.</HFText>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <HFButton label="평가 시작하기" variant="primary" />
          </div>
        </HFCard>
      </div>

      {/* Dimmed content behind */}
      <div style={{ opacity: 0.3, display: 'flex', gap: 16, flex: 1 }}>
        <HFPatientStatePanel showEndBtn={false} />
        <HFCard style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <HFBubble role="patient" text="...숨쉬기가 힘들어요." />
          <HFBubble role="user" text="천천히 해보세요." />
        </HFCard>
      </div>
    </div>
  </div>
);

// ── S5: 디브리핑 ────────────────────────────────────────────────────────────
const HFScreenDebriefing = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFSimNav current={2} />
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <HFText as="h1" size={20} weight={600} style={{ display: 'block', letterSpacing: '-0.02em', marginBottom: 4 }}>시뮬레이션을 마쳤어요</HFText>
          <HFText size={14} muted style={{ display: 'block' }}>평가 결과를 확인해 보세요</HFText>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <HFStat label="총점" value="82점" sub="Kalamazoo" />
          <HFStat label="소요 시간" value="6분 42초" sub="제한 10분" />
          <HFStat label="대화 턴" value="14회" />
        </div>

        {/* 2-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <HFText size={15} weight={600}>항목별 점수</HFText>
            <HFDivider />
            {[
              { label: '환자 맞이 및 자기소개', value: 90 },
              { label: '개방형 질문 사용', value: 75 },
              { label: '경청 및 공감 표현', value: 82 },
              { label: '환자 감정 확인', value: 68 },
              { label: '정보 전달 명확성', value: 80 },
              { label: '환자 동의 및 자율성 존중', value: 70 },
            ].map((g, i) => <HFGauge key={i} {...g} />)}
          </HFCard>
          <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <HFText size={15} weight={600}>디브리핑</HFText>
            <HFDivider />
            <HFText size={14} muted style={{ lineHeight: '24px' }}>
              자기소개와 초기 접근은 매우 효과적이었어요. 환자의 신뢰를 빠르게 형성했고, 불안감이 유의미하게 낮아졌어요.
            </HFText>
            <HFText size={14} muted style={{ lineHeight: '24px' }}>
              다만 개방형 질문보다 폐쇄형 질문의 비율이 높았어요. 다음에는 "어떻게 느끼세요?"와 같은 개방형 질문을 의식적으로 활용해 보세요.
            </HFText>
          </HFCard>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <HFButton label="시나리오 목록으로" variant="secondary" />
          <HFButton label="같은 시나리오 다시 도전" variant="primary" />
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  HFSimNav, HFBubble, HFTypingBubble, HFScenarioTooltip, HFPatientStatePanel,
  HFScreenSimStart, HFScreenPBL, HFScreenPBLWaiting, HFScreenPBLSummary,
  HFScreenSimulation, HFScreenSimWaiting, HFScreenSimTimeout, HFScreenDebriefing,
});
