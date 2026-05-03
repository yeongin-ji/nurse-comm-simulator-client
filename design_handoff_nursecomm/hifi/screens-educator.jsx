
// ─── Hi-Fi Educator Screens ─────────────────────────────────────────────────

// ── E1: 학생 목록 ───────────────────────────────────────────────────────────
const HFScreenStudentList = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="educator" active="학생 목록" />
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <HFText as="h1" size={22} weight={600} style={{ display: 'block', letterSpacing: '-0.02em', marginBottom: 4 }}>학생 목록</HFText>
          <HFText size={14} muted style={{ display: 'block' }}>학생별 학습 현황을 확인하고 피드백을 남길 수 있어요</HFText>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <HFStat label="전체 학생" value="24명" />
          <HFStat label="이번 주 세션" value="37회" />
          <HFStat label="피드백 필요" value="12건" sub="코멘트 미작성" />
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <HFInput
            placeholder="이름 또는 학번으로 검색..."
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HF.fgSubtle} strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
            style={{ maxWidth: 320 }}
          />
        </div>

        {/* Table */}
        <HFCard style={{ padding: 0, overflow: 'hidden' }}>
          <HFTableRow header cells={[
            { label: '학번', w: '100px' },
            { label: '이름', w: '80px' },
            { label: '이메일' },
            { label: '세션', w: '64px' },
            { label: '최근 수행일', w: '110px' },
            { label: '평균', w: '64px' },
            { label: '', w: '80px' },
          ]} />
          {[
            { id: '20210101', name: '김간호', email: 'kim@univ.ac.kr', sessions: 5, last: '2026.04.28', avg: '79점' },
            { id: '20210202', name: '이실습', email: 'lee@univ.ac.kr', sessions: 3, last: '2026.04.25', avg: '82점' },
            { id: '20210303', name: '박학생', email: 'park@univ.ac.kr', sessions: 7, last: '2026.04.29', avg: '71점' },
            { id: '20210404', name: '최간호', email: 'choi@univ.ac.kr', sessions: 1, last: '2026.04.10', avg: '65점' },
            { id: '20210505', name: '정실습', email: 'jung@univ.ac.kr', sessions: 0, last: '—', avg: '—' },
          ].map((s, i) => (
            <HFTableRow key={i} cells={[
              { label: s.id, w: '100px' },
              { label: s.name, w: '80px', style: { fontWeight: 500 } },
              { label: s.email },
              { label: `${s.sessions}회`, w: '64px' },
              { label: s.last, w: '110px' },
              { label: s.avg, w: '64px', style: { fontWeight: s.avg !== '—' ? 500 : 400 } },
              { label: '이력 보기', w: '80px', style: { color: HF.accent, cursor: 'pointer' } },
            ]} />
          ))}
        </HFCard>

        {/* Info note */}
        <div style={{
          marginTop: 12, background: HF.muted, borderRadius: HF.radius, padding: '10px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <LucideIcon d={ICONS.alertCircle} size={14} color={HF.fgSubtle} style={{ marginTop: 2 }} />
          <HFText size={12} muted style={{ lineHeight: '18px' }}>학생 정보는 열람만 가능해요. 추가·수정·삭제는 관리자에게 문의하세요.</HFText>
        </div>
      </div>
    </div>
  </div>
);

// ── E2: 학생별 세션 이력 ────────────────────────────────────────────────────
const HFScreenStudentHistory = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="educator" active="학생 목록" />
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <HFText size={13} style={{ color: HF.accent, cursor: 'pointer' }}>학생 목록</HFText>
          <LucideIcon d={ICONS.chevronRight} size={14} color={HF.fgSubtle} />
          <HFText size={13}>김간호 (20210101)</HFText>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <HFText as="h1" size={20} weight={600} style={{ display: 'block', letterSpacing: '-0.02em', marginBottom: 4 }}>김간호 학습 이력</HFText>
          <HFText size={14} muted>학번: 20210101 · kim@univ.ac.kr</HFText>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <HFStat label="총 세션" value="5회" />
          <HFStat label="평균 점수" value="79점" />
          <HFStat label="내 코멘트" value="2건" />
        </div>

        {/* Table */}
        <HFCard style={{ padding: 0, overflow: 'hidden' }}>
          <HFTableRow header cells={[
            { label: '시나리오 (질환)' },
            { label: '수행일시', w: '130px' },
            { label: '상태', w: '70px' },
            { label: '총점', w: '64px' },
            { label: '코멘트', w: '70px' },
            { label: '', w: '80px' },
          ]} />
          {[
            { disease: 'COPD', date: '2026.04.28 14:22', status: '완료', score: '82점', comments: 0 },
            { disease: 'COPD', date: '2026.04.20 10:05', status: '완료', score: '74점', comments: 1 },
            { disease: '폐렴', date: '2026.04.15 16:30', status: '완료', score: '80점', comments: 0 },
            { disease: 'COPD', date: '2026.04.10 09:20', status: '완료', score: '68점', comments: 1 },
            { disease: '심부전', date: '2026.04.05 11:00', status: '완료', score: '72점', comments: 0 },
          ].map((r, i) => (
            <HFTableRow key={i} cells={[
              { label: r.disease },
              { label: r.date, w: '130px' },
              { label: r.status, w: '70px', style: { color: HF.success } },
              { label: r.score, w: '64px', style: { fontWeight: 500 } },
              { label: r.comments > 0 ? `${r.comments}개` : '없음', w: '70px', style: { color: r.comments > 0 ? HF.accent : HF.fgSubtle } },
              { label: '상세 보기', w: '80px', style: { color: HF.accent, cursor: 'pointer' } },
            ]} />
          ))}
        </HFCard>
      </div>
    </div>
  </div>
);

// ── E3: 세션 상세 (교육자용) ────────────────────────────────────────────────
const HFScreenSessionDetail = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="educator" active="학생 목록" />
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <HFText size={13} style={{ color: HF.accent, cursor: 'pointer' }}>학생 목록</HFText>
          <LucideIcon d={ICONS.chevronRight} size={14} color={HF.fgSubtle} />
          <HFText size={13} style={{ color: HF.accent, cursor: 'pointer' }}>김간호</HFText>
          <LucideIcon d={ICONS.chevronRight} size={14} color={HF.fgSubtle} />
          <HFText size={13}>COPD · 2026.04.28</HFText>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
          {/* Left: evaluation + conversation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Evaluation */}
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HFText size={16} weight={600}>평가 결과</HFText>
                  <HFBadge label="Kalamazoo" variant="accent" />
                </div>
                <HFText size={24} weight={600} style={{ color: HF.accent, letterSpacing: '-0.03em' }}>82<HFText size={14} weight={400} muted>점</HFText></HFText>
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
              <HFDivider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <HFText size={14} weight={600}>디브리핑</HFText>
                <HFText size={14} muted style={{ lineHeight: '24px' }}>
                  자기소개와 초기 접근은 효과적이었어요. 환자의 신뢰를 빠르게 형성했지만, 개방형 질문 활용이 부족했어요.
                </HFText>
              </div>
            </HFCard>

            {/* Conversation log */}
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HFText size={16} weight={600}>대화 기록</HFText>
                <div style={{ display: 'flex', gap: 6 }}>
                  <HFBadge label="PBL 대화" />
                  <HFBadge label="시뮬레이션 대화" variant="accent" />
                </div>
              </div>
              <HFDivider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>시뮬레이션 대화</HFText>
                <HFBubble role="patient" text="(거칠게 숨을 몰아쉬며) 뭐가 필요해요? 어차피 나한테 관심 없잖아요..." />
                <HFBubble role="user" text="안녕하세요, 저는 담당 간호학생이에요. 지금 많이 힘드시죠?" />
                <HFBubble role="patient" text="(시선을 잠깐 돌리며) ...네, 숨쉬기가 너무 힘들어요." />
                <HFText size={12} subtle style={{ textAlign: 'center', padding: '8px 0' }}>— 전체 14턴 대화 —</HFText>
              </div>
            </HFCard>
          </div>

          {/* Right: comments + session info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Comments */}
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <HFText size={15} weight={600}>코멘트</HFText>
              <HFDivider />

              {/* Existing comment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <HFText size={13} weight={500}>김교수</HFText>
                  <HFText size={12} subtle>2026.04.29</HFText>
                </div>
                <HFText size={13} muted style={{ lineHeight: '20px' }}>
                  경청 부분에서 많이 나아졌어요. 다음에는 환자 감정 반영 연습을 더 해보세요.
                </HFText>
              </div>

              <HFDivider />

              {/* Add comment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <HFText size={13} weight={500}>코멘트 작성</HFText>
                <div style={{
                  minHeight: 72, padding: '10px 12px',
                  border: `1px solid ${HF.border}`, borderRadius: HF.radius,
                  background: HF.bg, display: 'flex', alignItems: 'flex-start',
                }}>
                  <HFText size={13} subtle>학생에게 피드백을 남겨주세요...</HFText>
                </div>
                <HFButton label="코멘트 등록" variant="primary" full />
              </div>
            </HFCard>

            {/* Session meta */}
            <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <HFText size={12} weight={500} subtle style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>세션 정보</HFText>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '시작 시각', value: '14:22' },
                  { label: '소요 시간', value: '6분 42초' },
                  { label: '세션 상태', value: '정상 종료' },
                  { label: '평가 도구', value: 'Kalamazoo' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <HFText size={13} muted>{m.label}</HFText>
                    <HFText size={13} weight={500}>{m.value}</HFText>
                  </div>
                ))}
              </div>
            </HFCard>

            {/* Note */}
            <div style={{
              background: HF.muted, borderRadius: HF.radius, padding: '10px 14px',
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <LucideIcon d={ICONS.alertCircle} size={14} color={HF.fgSubtle} style={{ marginTop: 2 }} />
              <HFText size={12} muted style={{ lineHeight: '18px' }}>코멘트는 추가만 가능해요. 수정·삭제는 할 수 없어요.</HFText>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  HFScreenStudentList,
  HFScreenStudentHistory,
  HFScreenSessionDetail,
});
