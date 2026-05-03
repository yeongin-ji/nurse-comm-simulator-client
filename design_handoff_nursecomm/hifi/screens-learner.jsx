
// ─── Hi-Fi Learner Screens ──────────────────────────────────────────────────

// ── Shared: Table Row ───────────────────────────────────────────────────────
const HFTableRow = ({ cells, header }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: cells.map(c => c.w || '1fr').join(' '),
    gap: 0, padding: '10px 16px', alignItems: 'center',
    background: header ? HF.muted : HF.bg,
    borderBottom: `1px solid ${HF.border}`,
  }}>
    {cells.map((c, i) => (
      <HFText key={i} size={13} weight={header ? 500 : 400} muted={header}
        style={{ ...c.style }}>{c.label}</HFText>
    ))}
  </div>
);

// ── Shared: Stat Card ───────────────────────────────────────────────────────
const HFStat = ({ label, value, sub }) => (
  <HFCard style={{ flex: 1, padding: 16 }}>
    <HFText size={12} subtle style={{ display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</HFText>
    <HFText size={24} weight={600} style={{ display: 'block', letterSpacing: '-0.02em' }}>{value}</HFText>
    {sub && <HFText size={12} muted style={{ display: 'block', marginTop: 3 }}>{sub}</HFText>}
  </HFCard>
);

// ── Shared: Gauge ───────────────────────────────────────────────────────────
const HFGauge = ({ label, value, color = HF.accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <HFText size={13}>{label}</HFText>
      <HFText size={13} weight={500}>{value}%</HFText>
    </div>
    <div style={{ height: 6, background: HF.muted, borderRadius: 9999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 9999, transition: 'width 0.3s' }} />
    </div>
  </div>
);

// ── Patient Avatar (AI illustration placeholder) ────────────────────────────
const HFPatientAvatar = ({ size = 48, name = '', style: outerStyle }) => {
  const colors = ['#DBEAFE', '#FCE7F3', '#D1FAE5', '#FEF3C7', '#E0E7FF'];
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = colors[hash % colors.length];
  const initial = name.charAt(0) || '?';
  return (
    <div style={{
      width: size, height: size * 1.15, borderRadius: size > 60 ? 12 : 8, flexShrink: 0,
      background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      position: 'relative', overflow: 'hidden',
      ...outerStyle,
    }}>
      {/* Simple illustrated face */}
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="15" r="10" fill="rgba(0,0,0,0.08)" />
        <circle cx="16" cy="13" r="1.5" fill="rgba(0,0,0,0.3)" />
        <circle cx="24" cy="13" r="1.5" fill="rgba(0,0,0,0.3)" />
        <path d="M16 18c2 2 6 2 8 0" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M8 38c0-6.627 5.373-12 12-12s12 5.373 12 38" fill="rgba(0,0,0,0.06)" />
      </svg>
      <HFText size={Math.max(9, size * 0.18)} weight={600} style={{ color: 'rgba(0,0,0,0.35)', position: 'absolute', bottom: 3 }}>{initial}</HFText>
    </div>
  );
};

// ── L1: 시나리오 목록 ───────────────────────────────────────────────────────
const HFScreenScenarioList = () => {
  const [hoveredIdx, setHoveredIdx] = React.useState(-1);
  const scenarios = [
    { disease: 'COPD', patient: '이영수', age: '23/M', difficulty: '중', count: 3, lastDate: '2026.04.28' },
    { disease: '폐렴', patient: '김미래', age: '67/F', difficulty: '하', count: 1, lastDate: '2026.04.20' },
    { disease: '심부전', patient: '박준호', age: '54/M', difficulty: '상', count: 0, lastDate: null },
  ];

  return (
    <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HFNav role="learner" active="시나리오" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <HFText as="h1" size={22} weight={600} style={{ display: 'block', letterSpacing: '-0.02em' }}>내 시나리오</HFText>
              <HFText size={14} muted style={{ display: 'block' }}>가상 환자를 선택해 시뮬레이션을 시작하세요</HFText>
            </div>
            <HFButton
              label="새 시나리오 만들기"
              variant="primary"
              icon={<span style={{ fontSize: 16, lineHeight: 1 }}>+</span>}
            />
          </div>

          {/* Scenario cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {scenarios.map((s, i) => (
              <HFCard
                key={i}
                onClick={() => {}}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  cursor: 'pointer', padding: '16px 20px',
                  transition: 'box-shadow 150ms, border-color 150ms',
                  boxShadow: hoveredIdx === i ? '0 4px 12px -4px rgba(0,0,0,0.08)' : undefined,
                  borderColor: hoveredIdx === i ? HF.borderStrong : HF.border,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
              >
                <HFPatientAvatar size={44} name={s.patient} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HFText size={15} weight={500}>{s.disease}</HFText>
                    <HFText size={14} muted>{s.patient} ({s.age})</HFText>
                    <HFBadge label={`난이도 ${s.difficulty}`} />
                  </div>
                  <HFText size={13} muted>
                    {s.lastDate ? `최근 시뮬레이션: ${s.lastDate} · ${s.count}회 수행` : '아직 시뮬레이션을 시작하지 않았어요'}
                  </HFText>
                </div>
                <LucideIcon d={ICONS.chevronRight} size={18} color={HF.fgSubtle} />
              </HFCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── L2: 시나리오 생성 모달 ──────────────────────────────────────────────────
const HFScreenScenarioCreate = () => {
  const [selectedDiff, setSelectedDiff] = React.useState(1);
  return (
    <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HFNav role="learner" active="시나리오" />
      <div style={{
        flex: 1, background: 'rgba(9,9,11,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <HFCard elevated style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 24, padding: 28 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <HFText size={18} weight={600}>새 시나리오 만들기</HFText>
            <div style={{ cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HF.fgSubtle} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </div>
          </div>
          <HFDivider />

          {/* Disease selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <HFText size={14} weight={500}>질환 선택</HFText>
              <HFButton label="랜덤 선택" variant="secondary" size="sm" />
            </div>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: HF.muted, borderRadius: HF.radius }}>
              {['호흡기계', '폐쇄성폐질환'].map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <HFText size={12} subtle>/</HFText>}
                  <HFText size={12} weight={500} style={{ color: HF.accent, cursor: 'pointer' }}>{crumb}</HFText>
                </React.Fragment>
              ))}
              <HFText size={12} subtle>/ 선택 중</HFText>
            </div>

            {/* Disease list */}
            <div style={{ border: `1px solid ${HF.border}`, borderRadius: HF.radius, overflow: 'hidden' }}>
              {[
                { name: '기관지 천식', selected: true },
                { name: 'COPD', selected: false },
                { name: '기관지 확장증', selected: false },
              ].map((d, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  borderBottom: i < 2 ? `1px solid ${HF.border}` : 'none',
                  background: d.selected ? 'rgba(37,99,235,0.05)' : HF.bg,
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  transition: 'background 100ms',
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 9999, flexShrink: 0,
                    border: `2px solid ${d.selected ? HF.accent : HF.border}`,
                    background: d.selected ? HF.accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {d.selected && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <HFText size={14} weight={d.selected ? 500 : 400}>{d.name}</HFText>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <HFText size={14} weight={500}>난이도</HFText>
            <div style={{ display: 'flex', gap: 8 }}>
              {['하', '중', '상'].map((d, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDiff(i)}
                  style={{
                    flex: 1, height: 36, borderRadius: HF.radius,
                    border: `1px solid ${i === selectedDiff ? HF.primary : HF.border}`,
                    background: i === selectedDiff ? HF.primary : HF.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 120ms',
                  }}
                >
                  <HFText size={14} weight={500} style={{ color: i === selectedDiff ? HF.onPrimary : HF.fgMuted }}>{d}</HFText>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{
            background: HF.muted, borderRadius: HF.radius, padding: '10px 14px',
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <LucideIcon d={ICONS.alertCircle} size={14} color={HF.fgSubtle} style={{ marginTop: 2 }} />
            <HFText size={12} muted style={{ lineHeight: '18px' }}>
              가상환자 정보, 딜레마 케이스, 시나리오를 순서대로 만들어요 (약 10~20초)
            </HFText>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <HFButton label="취소" variant="ghost" />
            <HFButton label="만들기" variant="primary" />
          </div>
        </HFCard>
      </div>
    </div>
  );
};

// ── L3: 시나리오 상세 ───────────────────────────────────────────────────────
const HFScreenScenarioDetail = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="learner" active="시나리오" />
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <HFText size={13} style={{ color: HF.accent, cursor: 'pointer' }}>시나리오</HFText>
          <LucideIcon d={ICONS.chevronRight} size={14} color={HF.fgSubtle} />
          <HFText size={13}>COPD</HFText>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Scenario card */}
            <HFCard style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <HFPatientAvatar size={100} name="OOO" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <HFText size={18} weight={600}>COPD 시나리오</HFText>
                    <HFBadge label="난이도 중" />
                  </div>
                  <HFText size={13} muted>OOO (M/47) · 호흡기계 &gt; 폐쇄성폐질환</HFText>
                  <HFDivider />
                  <HFText size={14} style={{ lineHeight: '24px' }}>
                    COPD 환자인 OOO님 (M/47)은 호흡곤란을 호소하여 간호사가 입술 오므리기 호흡(Pursed-lip breathing)과 복식 호흡을 교육하려 합니다. 하지만 환자는 "숨차 죽겠는데 자꾸 뭘 시키냐, 그냥 가만히 있게 내버려 달라"며 교육을 완강히 거부합니다.
                  </HFText>
                </div>
              </div>
            </HFCard>

            {/* Session history */}
            <HFCard style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${HF.border}` }}>
                <HFText size={15} weight={600}>수행 이력</HFText>
              </div>
              <HFTableRow header cells={[
                { label: '회차', w: '56px' }, { label: '수행일시' }, { label: '상태' }, { label: '점수', w: '64px' }, { label: '', w: '80px' }
              ]} />
              {[
                { n: '3회', date: '2026.04.28 14:22', status: '평가 완료', score: '82점' },
                { n: '2회', date: '2026.04.15 10:05', status: '평가 완료', score: '74점' },
                { n: '1회', date: '2026.04.01 09:30', status: '평가 완료', score: '68점' },
              ].map((r, i) => (
                <HFTableRow key={i} cells={[
                  { label: r.n, w: '56px' }, { label: r.date }, { label: r.status },
                  { label: r.score, w: '64px', style: { fontWeight: 500 } },
                  { label: '보기', w: '80px', style: { color: HF.accent, cursor: 'pointer' } },
                ]} />
              ))}
            </HFCard>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <HFText size={15} weight={600} style={{ display: 'block' }}>시뮬레이션</HFText>
              <HFText size={13} muted style={{ display: 'block', lineHeight: '20px' }}>
                PBL 단계에서 간호 방향을 논의한 뒤, 가상 환자와 대화를 시작해요
              </HFText>
              <HFDivider />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LucideIcon d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" size={14} color={HF.fgSubtle} />
                <HFText size={12} muted>PBL: 최대 5턴 · 대화: 10분 제한</HFText>
              </div>
              <HFButton label="시뮬레이션 시작하기" variant="primary" full />
            </HFCard>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── L4: 학습 이력 ───────────────────────────────────────────────────────────
const HFScreenHistory = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="learner" active="학습 이력" />
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <HFText as="h1" size={22} weight={600} style={{ display: 'block', letterSpacing: '-0.02em', marginBottom: 4 }}>학습 이력</HFText>
          <HFText size={14} muted style={{ display: 'block' }}>지금까지 수행한 시뮬레이션 기록을 확인하세요</HFText>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <HFStat label="총 세션" value="4회" />
          <HFStat label="평균 점수" value="74점" />
          <HFStat label="시나리오" value="2종" />
        </div>

        {/* Table */}
        <HFCard style={{ padding: 0, overflow: 'hidden' }}>
          <HFTableRow header cells={[
            { label: '시나리오 (질환)' }, { label: '수행일시' }, { label: '총점', w: '64px' }, { label: '코멘트', w: '80px' }, { label: '', w: '80px' }
          ]} />
          {[
            { disease: 'COPD', date: '2026.04.28', score: '82점', comment: '1개' },
            { disease: 'COPD', date: '2026.04.15', score: '74점', comment: '없음' },
            { disease: 'COPD', date: '2026.04.01', score: '68점', comment: '2개' },
            { disease: '폐렴', date: '2026.04.20', score: '77점', comment: '없음' },
          ].map((r, i) => (
            <HFTableRow key={i} cells={[
              { label: r.disease }, { label: r.date },
              { label: r.score, w: '64px', style: { fontWeight: 500 } },
              { label: r.comment, w: '80px', style: { color: r.comment !== '없음' ? HF.accent : HF.fgSubtle } },
              { label: '상세 보기', w: '80px', style: { color: HF.accent, cursor: 'pointer' } },
            ]} />
          ))}
        </HFCard>
      </div>
    </div>
  </div>
);

// ── L5: 세션 결과 상세 (학습자) ─────────────────────────────────────────────
const HFScreenResult = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="learner" active="학습 이력" />
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <HFText size={13} style={{ color: HF.accent, cursor: 'pointer' }}>학습 이력</HFText>
          <LucideIcon d={ICONS.chevronRight} size={14} color={HF.fgSubtle} />
          <HFText size={13}>COPD · 3회차</HFText>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <HFText size={16} weight={600}>평가 결과</HFText>
                <HFBadge label="Kalamazoo 체크리스트" variant="accent" />
              </div>
              <HFDivider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: '환자 맞이 및 자기소개', value: 90 },
                  { label: '개방형 질문 사용', value: 75 },
                  { label: '경청 및 공감 표현', value: 82 },
                  { label: '환자 감정 확인', value: 68 },
                  { label: '정보 전달 명확성', value: 80 },
                  { label: '환자 동의 및 자율성 존중', value: 70 },
                ].map((g, i) => <HFGauge key={i} {...g} />)}
              </div>
            </HFCard>

            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <HFText size={16} weight={600} style={{ display: 'block' }}>디브리핑</HFText>
              <HFDivider />
              <HFText size={14} muted style={{ display: 'block', lineHeight: '24px' }}>
                자기소개와 초기 접근은 매우 효과적이었어요. 환자의 신뢰를 빠르게 형성하는 데 성공했으며, 이후 대화에서 환자의 불안감이 유의미하게 낮아졌습니다.
              </HFText>
              <HFText size={14} muted style={{ display: 'block', lineHeight: '24px' }}>
                다만 개방형 질문보다 폐쇄형 질문의 비율이 높았어요. 다음에는 "어떻게 느끼세요?"와 같은 개방형 질문을 의식적으로 활용해 보세요.
              </HFText>
            </HFCard>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Score summary */}
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <HFText size={32} weight={600} style={{ display: 'block', textAlign: 'center', letterSpacing: '-0.03em' }}>82<HFText size={16} weight={400} muted>점</HFText></HFText>
              <HFDivider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '소요 시간', value: '6분 42초' },
                  { label: '대화 턴', value: '14회' },
                  { label: '제한 시간', value: '10분' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <HFText size={13} muted>{m.label}</HFText>
                    <HFText size={13} weight={500}>{m.value}</HFText>
                  </div>
                ))}
              </div>
            </HFCard>

            {/* Comments */}
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <HFText size={14} weight={600} style={{ display: 'block' }}>교수자 코멘트</HFText>
              <HFDivider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <HFText size={13} weight={500}>김교수</HFText>
                  <HFText size={12} subtle>2026.04.29</HFText>
                </div>
                <HFText size={13} muted style={{ display: 'block', lineHeight: '20px' }}>
                  경청 부분에서 많이 나아졌어요. 다음에는 환자 감정 반영 연습을 더 해보세요.
                </HFText>
              </div>
            </HFCard>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  HFTableRow, HFStat, HFGauge, HFPatientAvatar,
  HFScreenScenarioList, HFScreenScenarioCreate,
  HFScreenScenarioDetail, HFScreenHistory, HFScreenResult,
});
