
// ─── Hi-Fi Design System Components ─────────────────────────────────────────
// Based on Minimal Clean (DESIGN.md) + Lucide icons + UX writing principles

const HF = {
  bg: '#FFFFFF',
  surface: '#FAFAFA',
  muted: '#F4F4F5',
  elevated: '#FFFFFF',
  border: '#E4E4E7',
  borderStrong: '#D4D4D8',
  fg: '#09090B',
  fgMuted: '#52525B',
  fgSubtle: '#A1A1AA',
  primary: '#18181B',
  onPrimary: '#FAFAFA',
  accent: '#2563EB',
  onAccent: '#FFFFFF',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  focusRing: '#2563EB',
  radius: 6,
  radiusMd: 8,
  radiusLg: 12,
  font: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: 'JetBrains Mono, ui-monospace, monospace',
};

// ── Lucide Icon (inline SVG) ────────────────────────────────────────────────
const LucideIcon = ({ d, size = 18, color = HF.fgMuted, strokeWidth = 1.8, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}>
    {Array.isArray(d) ? d.map((p, i) => {
      if (p.startsWith('C')) return <circle key={i} cx={p.split(',')[1]} cy={p.split(',')[2]} r={p.split(',')[3]} />;
      if (p.startsWith('R')) { const pts = p.split(','); return <rect key={i} x={pts[1]} y={pts[2]} width={pts[3]} height={pts[4]} rx={pts[5] || 0} />; }
      return <path key={i} d={p} />;
    }) : <path d={d} />}
  </svg>
);

// Common icon paths
const ICONS = {
  eye: ['M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0', 'C,12,12,3'],
  eyeOff: ['M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49', 'M14.084 14.158a3 3 0 0 1-4.242-4.242', 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.21-5.197', 'M1 1l22 22'],
  mail: ['R,2,4,20,16,2', 'M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  lock: ['R,3,11,18,11,2', 'M7 11V7a5 5 0 0 1 10 0v4'],
  user: ['C,12,8,5', 'M20 21a8 8 0 0 0-16 0'],
  hash: ['M4 9h16', 'M4 15h16', 'M10 3L8 21', 'M16 3L14 21'],
  settings: ['C,12,12,3', 'M12 1v2m0 18v2m-9-11H1m22 0h-2m-2.05-7.95l-1.41 1.41m-11.08 11.08l-1.41 1.41m0-14.9l1.41 1.41m11.08 11.08l1.41 1.41'],
  chevronRight: ['M9 18l6-6-6-6'],
  logOut: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  arrowLeft: ['M19 12H5', 'M12 19l-7-7 7-7'],
  check: ['M20 6L9 17l-5-5'],
  alertCircle: ['C,12,12,10', 'M12 8v4', 'M12 16h.01'],
  loader: ['M12 2v4', 'M12 18v4', 'M4.93 4.93l2.83 2.83', 'M16.24 16.24l2.83 2.83', 'M2 12h4', 'M18 12h4', 'M4.93 19.07l2.83-2.83', 'M16.24 7.76l2.83-2.83'],
  mic: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  image: ['R,3,3,18,18,2', 'C,8.5,8.5,1.5', 'M21 15l-5-5L5 21'],
};

// ── Text ────────────────────────────────────────────────────────────────────
const HFText = ({ as = 'span', size = 14, weight = 400, color, muted, subtle, style, children, ...props }) => {
  const Tag = as;
  return (
    <Tag style={{
      fontFamily: HF.font, fontSize: size, fontWeight: weight,
      color: muted ? HF.fgMuted : subtle ? HF.fgSubtle : (color || HF.fg),
      lineHeight: size <= 12 ? '16px' : size <= 14 ? '20px' : size <= 16 ? '24px' : size <= 24 ? '32px' : '40px',
      margin: 0, letterSpacing: size >= 20 ? '-0.02em' : size >= 16 ? '-0.01em' : undefined,
      ...style,
    }} {...props}>{children}</Tag>
  );
};

// ── Button ──────────────────────────────────────────────────────────────────
const HFButton = ({ label, variant = 'primary', size = 'md', icon, iconRight, full, disabled, style, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const sizes = {
    sm: { height: 28, padding: '0 10px', fontSize: 12 },
    md: { height: 36, padding: '0 16px', fontSize: 13 },
    lg: { height: 40, padding: '0 20px', fontSize: 14 },
  };
  const variants = {
    primary: {
      background: hovered ? '#27272A' : HF.primary,
      color: HF.onPrimary, border: '1px solid transparent',
    },
    secondary: {
      background: hovered ? HF.surface : HF.bg,
      color: HF.fg, border: `1px solid ${HF.border}`,
    },
    ghost: {
      background: hovered ? HF.muted : 'transparent',
      color: hovered ? HF.fg : HF.fgMuted, border: '1px solid transparent',
    },
    danger: {
      background: hovered ? '#B91C1C' : HF.danger,
      color: '#fff', border: '1px solid transparent',
    },
    accent: {
      background: hovered ? '#1D4ED8' : HF.accent,
      color: HF.onAccent, border: '1px solid transparent',
    },
  };
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s, ...v,
        borderRadius: HF.radius,
        fontFamily: HF.font, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 120ms, border-color 120ms, color 120ms',
        width: full ? '100%' : undefined,
        outline: 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon}
      {label}
      {iconRight}
    </button>
  );
};

// ── Input ───────────────────────────────────────────────────────────────────
const HFInput = ({ label, placeholder, type = 'text', value, error, readOnly, suffix, icon, style, inputStyle }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      {label && <HFText size={13} weight={500} muted>{label}</HFText>}
      <div style={{
        height: 36, padding: '0 12px',
        border: `1px solid ${error ? HF.danger : focused ? HF.focusRing : HF.border}`,
        borderRadius: HF.radius,
        background: readOnly ? HF.muted : HF.bg,
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'border-color 120ms, box-shadow 120ms',
        boxShadow: focused && !error ? `0 0 0 3px rgba(37,99,235,0.12)` : error ? `0 0 0 3px rgba(220,38,38,0.08)` : 'none',
        ...inputStyle,
      }}>
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: HF.font, fontSize: 14, color: readOnly ? HF.fgMuted : HF.fg,
            width: '100%',
          }}
        />
        {suffix && <HFText size={12} subtle>{suffix}</HFText>}
      </div>
      {error && <HFText size={12} style={{ color: HF.danger }}>{error}</HFText>}
    </div>
  );
};

// ── Card ────────────────────────────────────────────────────────────────────
const HFCard = ({ children, style, elevated, onClick }) => (
  <div onClick={onClick} style={{
    background: HF.elevated,
    border: `1px solid ${HF.border}`,
    borderRadius: HF.radiusMd,
    padding: 24,
    boxShadow: elevated ? '0 4px 8px -2px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)' : '0 1px 1px rgba(0,0,0,0.04)',
    ...style,
  }}>{children}</div>
);

// ── Badge ───────────────────────────────────────────────────────────────────
const HFBadge = ({ label, variant = 'default' }) => {
  const variants = {
    default: { background: HF.muted, color: HF.fgMuted },
    success: { background: 'rgba(22,163,74,0.1)', color: HF.success },
    warning: { background: 'rgba(245,158,11,0.12)', color: '#a16207' },
    danger: { background: 'rgba(220,38,38,0.1)', color: HF.danger },
    accent: { background: 'rgba(37,99,235,0.08)', color: HF.accent },
  };
  const v = variants[variant] || variants.default;
  return (
    <span style={{
      ...v, fontSize: 12, fontWeight: 500, fontFamily: HF.font,
      padding: '2px 10px', borderRadius: 9999, whiteSpace: 'nowrap', lineHeight: '18px',
    }}>{label}</span>
  );
};

// ── Divider ─────────────────────────────────────────────────────────────────
const HFDivider = ({ style }) => (
  <div style={{ height: 1, background: HF.border, ...style }} />
);

// ── Toggle ──────────────────────────────────────────────────────────────────
const HFToggle = ({ on, onChange, disabled }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={() => !disabled && onChange && onChange(!on)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 22, borderRadius: 9999,
        background: on ? HF.fg : HF.borderStrong,
        display: 'flex', alignItems: 'center',
        padding: '0 3px', cursor: disabled ? 'default' : 'pointer',
        transition: 'background 150ms',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
        boxShadow: hovered && !disabled ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 9999, background: '#fff',
        marginLeft: on ? 'auto' : 0,
        transition: 'margin 150ms',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }} />
    </div>
  );
};

// ── Nav ─────────────────────────────────────────────────────────────────────
const HFNav = ({ role = 'learner', active = '', userName = '홍길동' }) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  return (
    <div style={{
      height: 52, background: HF.surface,
      borderBottom: `1px solid ${HF.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <HFText size={15} weight={600} style={{ letterSpacing: '-0.02em' }}>NurseComm</HFText>
        <div style={{ width: 1, height: 20, background: HF.border }} />
        {role === 'learner' ? (
          <>
            <HFNavLink label="시나리오" active={active === '시나리오'} />
            <HFNavLink label="학습 이력" active={active === '학습 이력'} />
          </>
        ) : (
          <HFNavLink label="학생 목록" active={active === '학생 목록'} />
        )}
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 8px', borderRadius: HF.radius, transition: 'background 120ms' }}
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 9999,
          background: HF.muted, border: `1px solid ${HF.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LucideIcon d={ICONS.user} size={14} color={HF.fgMuted} />
        </div>
        <HFText size={13} weight={500}>{userName}</HFText>
        <HFBadge label={role === 'learner' ? '학습자' : '교육자'} />
      </div>
    </div>
  );
};

const HFNavLink = ({ label, active }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 13, fontWeight: active ? 500 : 400,
        fontFamily: HF.font,
        color: active ? HF.fg : hovered ? HF.fg : HF.fgMuted,
        padding: '6px 10px',
        borderRadius: HF.radius,
        background: active ? HF.muted : hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 120ms',
      }}
    >{label}</span>
  );
};

// ── Spinner ─────────────────────────────────────────────────────────────────
const HFSpinner = ({ size = 20, color = HF.fg }) => (
  <div style={{
    width: size, height: size, flexShrink: 0,
    border: `2px solid ${HF.border}`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'hf-spin 0.7s linear infinite',
  }} />
);

// inject keyframes
if (typeof document !== 'undefined' && !document.getElementById('hf-spin-style')) {
  const s = document.createElement('style');
  s.id = 'hf-spin-style';
  s.textContent = '@keyframes hf-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

Object.assign(window, {
  HF, LucideIcon, ICONS,
  HFText, HFButton, HFInput, HFCard, HFBadge,
  HFDivider, HFToggle, HFNav, HFNavLink, HFSpinner,
});
