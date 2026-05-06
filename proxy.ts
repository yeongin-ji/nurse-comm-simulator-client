import { NextResponse, type NextRequest } from "next/server";

// TODO(Stage D): switch to real cookie/session validation once auth API is wired.
const PROTECTED_PATTERNS = [
  /^\/scenarios(\/.*)?$/,
  /^\/history(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/sim(\/.*)?$/,
  /^\/students(\/.*)?$/,
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname));
  if (!isProtected) return NextResponse.next();

  const role = req.cookies.get("role")?.value;
  if (role) return NextResponse.next();

  // dev: allow without auth so pages render before MSW/auth lands
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("reason", "session_expired");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
