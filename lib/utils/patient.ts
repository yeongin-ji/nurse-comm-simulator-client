/** 성별 표기를 약자(M/F)로 변환. 알 수 없으면 원문 유지. */
export function toGenderShort(gender: string | undefined): string | undefined {
  if (!gender) return undefined;
  const v = gender.trim().toLowerCase();
  if (["남", "남성", "남자", "m", "male"].includes(v)) return "M";
  if (["여", "여성", "여자", "f", "female"].includes(v)) return "F";
  return gender;
}

/** "M/48" 형태로 성별/나이 결합. 둘 중 하나만 있으면 그것만 표시. */
export function formatGenderAge(
  gender: string | undefined,
  age: number | string | undefined
): string {
  return [toGenderShort(gender), age].filter(Boolean).join("/");
}
