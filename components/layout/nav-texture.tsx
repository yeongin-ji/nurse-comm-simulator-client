/**
 * Decorative texture overlay shared by Nav and SimNav so the navy gradient
 * header reads with depth rather than a flat fill. Purely cosmetic — sits
 * behind the header content and ignores pointer events.
 *
 * Layers (top → bottom in paint order):
 *   1. diagonal light sheen sweeping across the bar
 *   2. warm orange brand glow from the top-right
 * plus a 1px inner top highlight for an edge.
 */
export function NavTexture() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{
        backgroundImage: [
          "linear-gradient(100deg, transparent 32%, rgba(255,255,255,0.10) 47%, transparent 62%)",
          "radial-gradient(70% 220% at 100% 0%, rgba(249,115,22,0.12), transparent 60%)",
        ].join(", "),
      }}
    />
  );
}
