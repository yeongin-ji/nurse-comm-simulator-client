/**
 * Mockup patient portraits (static placeholders that stand in for the
 * not-yet-available server-generated patient image). Picked by gender.
 */
const PHOTOS = {
  M: "/patients/vp-man.png",
  F: "/patients/vp-woman.png",
} as const;

function normalizeGender(raw?: string | null): "M" | "F" | undefined {
  if (!raw) return undefined;
  const v = raw.trim();
  if (v === "M" || v === "F") return v;
  if (v.startsWith("남")) return "M";
  if (v.startsWith("여")) return "F";
  const l = v.toLowerCase();
  if (l === "male") return "M";
  if (l === "female") return "F";
  return undefined;
}

/**
 * Resolve a mockup portrait URL from a patient gender value.
 * `enabled` reflects the "환자 프로필 이미지 생성" setting — when off, returns
 * undefined so <PatientAvatar> falls back to the generated line illustration.
 */
export function patientPhotoByGender(
  gender?: string | null,
  enabled = true,
): string | undefined {
  if (!enabled) return undefined;
  const g = normalizeGender(gender);
  return g ? PHOTOS[g] : undefined;
}
