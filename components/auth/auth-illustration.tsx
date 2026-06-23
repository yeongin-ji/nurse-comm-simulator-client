import { cn } from "@/lib/utils/cn";

export type AuthIllustrationVariant = "login" | "signup";

// DS AuthShell brand panel: deep navy with orange/navy radial glows.
const PANEL_BG =
  "radial-gradient(700px 420px at 18% 8%, rgba(249,115,22,0.28), transparent 60%), radial-gradient(620px 520px at 92% 100%, rgba(56,108,176,0.45), transparent 55%), linear-gradient(150deg, #0F2444 0%, #15315B 55%, #173A6A 100%)";

/**
 * Decorative brand panel shown on the left of the auth screens.
 * Purely visual — no content (the brand lockup lives on the form side).
 * `variant` is accepted for call-site symmetry but no longer changes anything.
 */
export function AuthIllustration({
  className,
}: {
  variant?: AuthIllustrationVariant;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden md:block relative overflow-hidden w-[44%]",
        className
      )}
      style={{ background: PANEL_BG }}
      aria-hidden
    >
      {/* glassmorphic decorative circles */}
      <span className="absolute -top-[70px] -left-[70px] h-[240px] w-[240px] rounded-full border border-white/[0.12] bg-white/[0.06] backdrop-blur-[6px]" />
      <span className="absolute -bottom-[60px] -right-[40px] h-[200px] w-[200px] rounded-full border border-white/10 bg-[rgba(249,115,22,0.16)] backdrop-blur-[8px]" />
      <span className="absolute top-[40%] left-[52%] h-[120px] w-[120px] rounded-full border border-white/[0.08] bg-white/[0.05]" />
    </aside>
  );
}
