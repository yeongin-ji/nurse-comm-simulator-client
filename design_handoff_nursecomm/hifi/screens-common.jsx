
// ─── Hi-Fi Common Screens ───────────────────────────────────────────────────

// ── Login ────────────────────────────────────────────────────────────────────
const HFScreenLogin = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex' }}>
    {/* Left: illustration panel */}
    <div style={{
      width: '44%', background: `linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: 48, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', border: `1px solid rgba(37,99,235,0.08)` }} />
      <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(37,99,235,0.04)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Illustration placeholder */}
        <div style={{
          width: 180, height: 180, borderRadius: 24, margin: '0 auto',
          background: 'rgba(37,99,235,0.06)',
          border: `1px solid rgba(37,99,235,0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="28" r="14" stroke="#2563EB" strokeWidth="1.5" fill="rgba(37,99,235,0.08)" />
            <path d="M16 68c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="#2563EB" strokeWidth="1.5" fill="none" />
            <circle cx="56" cy="20" r="6" fill="rgba(37,99,235,0.15)" stroke="#2563EB" strokeWidth="1" />
            <path d="M53 20h6m-3-3v6" stroke="#2563EB" strokeWidth="1" />
          </svg>
        </div>
        <div>
          <HFText as="h2" size={20} weight={600} style={{ display: 'block', marginBottom: 8 }}>
            안전한 환경에서 연습하고,{'\n'}자신감을 키우세요
          </HFText>
          <HFText size={14} muted style={{ display: 'block', lineHeight: '22px' }}>
            가상 환자와의 시뮬레이션으로{'\n'}의사소통 역량을 키울 수 있습니다
          </HFText>
        </div>
      </div>
    </div>

    {/* Right: form */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <HFText as="h1" size={24} weight={600} style={{ display: 'block', letterSpacing: '-0.02em' }}>
            다시 만나서 반가워요
          </HFText>
          <HFText size={14} muted style={{ display: 'block' }}>
            이메일과 비밀번호를 입력해 주세요
          </HFText>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <HFInput
            label="이메일"
            placeholder="학교 이메일을 입력하세요"
            type="email"
            icon={<LucideIcon d={ICONS.mail} size={16} color={HF.fgSubtle} />}
          />
          <HFInput
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            type="password"
            icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <HFButton label="학습자로 시작" variant="primary" full />
          <HFButton label="교육자로 시작" variant="secondary" full />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <HFText size={13} muted>아직 계정이 없으신가요?</HFText>
          <HFText size={13} weight={500} style={{ color: HF.accent, cursor: 'pointer' }}>회원가입</HFText>
        </div>
      </div>
    </div>
  </div>
);

// ── Signup ───────────────────────────────────────────────────────────────────
const HFScreenSignup = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex' }}>
    {/* Left: illustration panel */}
    <div style={{
      width: '44%', background: `linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: 48, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', border: `1px solid rgba(37,99,235,0.08)` }} />
      <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(37,99,235,0.04)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 180, height: 180, borderRadius: 24, margin: '0 auto',
          background: 'rgba(37,99,235,0.06)',
          border: `1px solid rgba(37,99,235,0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="14" y="20" width="52" height="40" rx="6" stroke="#2563EB" strokeWidth="1.5" fill="rgba(37,99,235,0.06)" />
            <path d="M14 32h52" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="30" cy="44" r="6" fill="rgba(37,99,235,0.12)" stroke="#2563EB" strokeWidth="1" />
            <path d="M42 42h16m-16 6h10" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <HFText as="h2" size={20} weight={600} style={{ display: 'block', marginBottom: 8 }}>
            처음이시군요,{'\n'}환영합니다
          </HFText>
          <HFText size={14} muted style={{ display: 'block', lineHeight: '22px' }}>
            간단한 정보만 입력하면{'\n'}바로 시작할 수 있어요
          </HFText>
        </div>
      </div>
    </div>

    {/* Right: form */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <HFText as="h1" size={24} weight={600} style={{ display: 'block', letterSpacing: '-0.02em' }}>
            학습자 계정 만들기
          </HFText>
          <HFText size={14} muted style={{ display: 'block' }}>
            시뮬레이션을 시작하려면 계정이 필요해요
          </HFText>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HFInput
            label="이름"
            placeholder="실명을 입력하세요"
            icon={<LucideIcon d={ICONS.user} size={16} color={HF.fgSubtle} />}
          />
          <HFInput
            label="학번"
            placeholder="학번을 입력하세요"
            icon={<LucideIcon d={ICONS.hash} size={16} color={HF.fgSubtle} />}
          />
          <HFInput
            label="이메일"
            placeholder="학교 이메일을 입력하세요"
            type="email"
            icon={<LucideIcon d={ICONS.mail} size={16} color={HF.fgSubtle} />}
          />
          <div>
            <HFInput
              label="비밀번호"
              placeholder="8자 이상, 영문·숫자 조합"
              type="password"
              icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />}
            />
          </div>
          <HFInput
            label="비밀번호 확인"
            placeholder="한 번 더 입력하세요"
            type="password"
            icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />}
          />
        </div>

        <HFButton label="회원가입" variant="primary" full />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <HFText size={13} muted>이미 계정이 있으신가요?</HFText>
          <HFText size={13} weight={500} style={{ color: HF.accent, cursor: 'pointer' }}>로그인</HFText>
        </div>

        {/* Info note */}
        <div style={{
          background: HF.muted, borderRadius: HF.radius, padding: '10px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <LucideIcon d={ICONS.alertCircle} size={14} color={HF.fgSubtle} style={{ marginTop: 2 }} />
          <HFText size={12} muted style={{ lineHeight: '18px' }}>
            교육자 계정은 관리자를 통해 등록할 수 있어요
          </HFText>
        </div>
      </div>
    </div>
  </div>
);

// ── Signup Error State ──────────────────────────────────────────────────────
const HFScreenSignupError = () => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex' }}>
    <div style={{
      width: '44%', background: `linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: 48, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', border: `1px solid rgba(37,99,235,0.08)` }} />
      <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(37,99,235,0.04)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 180, height: 180, borderRadius: 24, margin: '0 auto',
          background: 'rgba(37,99,235,0.06)', border: `1px solid rgba(37,99,235,0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="14" y="20" width="52" height="40" rx="6" stroke="#2563EB" strokeWidth="1.5" fill="rgba(37,99,235,0.06)" />
            <path d="M14 32h52" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="30" cy="44" r="6" fill="rgba(37,99,235,0.12)" stroke="#2563EB" strokeWidth="1" />
            <path d="M42 42h16m-16 6h10" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <HFText as="h2" size={20} weight={600} style={{ display: 'block', marginBottom: 8 }}>처음이시군요,{'\n'}환영합니다</HFText>
          <HFText size={14} muted style={{ display: 'block', lineHeight: '22px' }}>간단한 정보만 입력하면{'\n'}바로 시작할 수 있어요</HFText>
        </div>
      </div>
    </div>

    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <HFText as="h1" size={24} weight={600} style={{ display: 'block', letterSpacing: '-0.02em' }}>학습자 계정 만들기</HFText>
          <HFText size={14} muted style={{ display: 'block' }}>시뮬레이션을 시작하려면 계정이 필요해요</HFText>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HFInput label="이름" value="홍길동" icon={<LucideIcon d={ICONS.user} size={16} color={HF.fgSubtle} />} />
          <HFInput label="학번" value="20210101" error="이미 등록된 학번이에요" icon={<LucideIcon d={ICONS.hash} size={16} color={HF.fgSubtle} />} />
          <HFInput label="이메일" value="hong@univ.ac.kr" error="이미 사용 중인 이메일이에요" type="email" icon={<LucideIcon d={ICONS.mail} size={16} color={HF.fgSubtle} />} />
          <HFInput label="비밀번호" value="abc" type="password" error="8자 이상, 영문·숫자를 함께 사용해 주세요" icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />} />
          <HFInput label="비밀번호 확인" value="abd" type="password" error="비밀번호가 일치하지 않아요" icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />} />
        </div>

        <HFButton label="회원가입" variant="primary" full />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <HFText size={13} muted>이미 계정이 있으신가요?</HFText>
          <HFText size={13} weight={500} style={{ color: HF.accent, cursor: 'pointer' }}>로그인</HFText>
        </div>
      </div>
    </div>
  </div>
);

// ── Login Fail Modal (Learner) ──────────────────────────────────────────────
const HFScreenLoginFail = ({ role = 'learner' }) => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', position: 'relative' }}>
    {/* Dimmed background — same as login */}
    <div style={{ width: '44%', background: `linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)`, opacity: 0.4 }} />
    <div style={{ flex: 1, opacity: 0.4 }} />

    {/* Modal overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(9,9,11,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <HFCard elevated style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 9999, flexShrink: 0,
            background: 'rgba(220,38,38,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LucideIcon d={ICONS.alertCircle} size={20} color={HF.danger} />
          </div>
          <div>
            <HFText size={16} weight={600} style={{ display: 'block' }}>로그인할 수 없어요</HFText>
            <HFText size={13} muted style={{ display: 'block' }}>{role === 'learner' ? '학습자' : '교육자'} 계정</HFText>
          </div>
        </div>
        <HFDivider />
        <HFText size={14} muted style={{ display: 'block', lineHeight: '22px' }}>
          이메일 또는 비밀번호가 올바르지 않아요.{'\n'}입력하신 정보를 다시 확인해 주세요.
        </HFText>

        {role === 'educator' && (
          <div style={{
            background: HF.muted, borderRadius: HF.radius, padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <HFText size={13} weight={500} style={{ display: 'block' }}>교육자 계정이 없으신가요?</HFText>
            <HFText size={13} muted style={{ display: 'block', lineHeight: '20px' }}>
              교육자 등록은 관리자에게 문의해 주세요
            </HFText>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <HFButton label="다시 시도할게요" variant="primary" />
        </div>
      </HFCard>
    </div>
  </div>
);

// ── Profile & Settings ──────────────────────────────────────────────────────
const HFScreenProfile = ({ role = 'learner' }) => {
  const [tts, setTts] = React.useState(true);
  const [profileImg, setProfileImg] = React.useState(false);
  const isLearner = role === 'learner';

  return (
    <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HFNav role={role} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 48px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <HFText as="h1" size={22} weight={600} style={{ display: 'block', letterSpacing: '-0.02em' }}>
              프로필 및 설정
            </HFText>
            <HFText size={14} muted style={{ display: 'block' }}>
              개인정보를 확인하고, 앱 설정을 관리할 수 있어요
            </HFText>
          </div>

          {/* Personal info */}
          <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HFText size={16} weight={600}>개인정보</HFText>
              <HFBadge label="비밀번호만 수정할 수 있어요" />
            </div>
            <HFDivider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <HFInput label="이름" value="홍길동" readOnly icon={<LucideIcon d={ICONS.user} size={16} color={HF.fgSubtle} />} suffix="읽기 전용" />
              <HFInput label={isLearner ? '학번' : '교번'} value={isLearner ? '20210101' : 'P2021001'} readOnly icon={<LucideIcon d={ICONS.hash} size={16} color={HF.fgSubtle} />} suffix="읽기 전용" />
              <HFInput label="이메일" value="hong@univ.ac.kr" readOnly icon={<LucideIcon d={ICONS.mail} size={16} color={HF.fgSubtle} />} suffix="읽기 전용" />
            </div>

            <HFDivider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <HFText size={14} weight={500}>비밀번호 변경</HFText>
              <HFInput label="현재 비밀번호" placeholder="현재 비밀번호를 입력하세요" type="password" icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />} />
              <HFInput label="새 비밀번호" placeholder="8자 이상, 영문·숫자 조합" type="password" icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />} />
              <HFInput label="새 비밀번호 확인" placeholder="한 번 더 입력하세요" type="password" icon={<LucideIcon d={ICONS.lock} size={16} color={HF.fgSubtle} />} />
            </div>
          </HFCard>

          {/* Settings */}
          <HFCard style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <HFText size={16} weight={600}>설정</HFText>
            <HFDivider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* TTS */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', borderBottom: `1px solid ${HF.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <LucideIcon d={ICONS.mic} size={18} color={HF.fgMuted} style={{ marginTop: 2 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <HFText size={14} weight={500}>TTS 음성 합성</HFText>
                    <HFText size={13} muted style={{ lineHeight: '18px' }}>환자의 응답을 음성으로 읽어줘요</HFText>
                  </div>
                </div>
                <HFToggle on={tts} onChange={setTts} />
              </div>

              {/* Profile Image */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <LucideIcon d={ICONS.image} size={18} color={HF.fgMuted} style={{ marginTop: 2 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <HFText size={14} weight={500}>환자 프로필 이미지 생성</HFText>
                    <HFText size={13} muted style={{ lineHeight: '18px' }}>시나리오 생성 시 환자 이미지를 자동으로 만들어요</HFText>
                  </div>
                </div>
                <HFToggle on={profileImg} onChange={setProfileImg} />
              </div>
            </div>
          </HFCard>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <HFButton label="취소" variant="ghost" />
            <HFButton label="저장하기" variant="primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Loading — Scenario ──────────────────────────────────────────────────────
const HFScreenLoading = ({ title, subtitle }) => (
  <div style={{ background: HF.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HFNav role="learner" />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, maxWidth: 320 }}>
        <HFSpinner size={36} />
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <HFText size={16} weight={600} style={{ display: 'block' }}>{title}</HFText>
          <HFText size={14} muted style={{ display: 'block', lineHeight: '22px' }}>{subtitle}</HFText>
        </div>
        <div style={{
          background: HF.muted, borderRadius: HF.radius, padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <LucideIcon d={ICONS.loader} size={14} color={HF.fgSubtle} />
          <HFText size={13} muted>처리 중이에요. 잠시만 기다려 주세요.</HFText>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  HFScreenLogin,
  HFScreenSignup,
  HFScreenSignupError,
  HFScreenLoginFail,
  HFScreenProfile,
  HFScreenLoading,
});
