import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/lib/query/provider";
import { MockProvider } from "@/lib/mocks/init";
import { Toaster } from "@/components/ui/toaster";

// Pretendard (UI sans) — self-hosted variable font via next/font/local.
// Served from our own domain (no runtime CDN dependency), auto-preloaded.
// wght axis covers Pretendard's full 45–920 range; we use 400–700.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "NurCoSim",
  description: "간호학생 의사소통 시뮬레이션 프로그램",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${jetbrainsMono.variable} h-full`}>
      {/* App-wide proportional scale-up (~+2pt on base text): zoom enlarges
          type, spacing, and icons together. Set inline so Tailwind v4's
          Lightning CSS doesn't strip the non-standard `zoom` property.
          Factor lives in --app-zoom (globals.css) so full-viewport layouts
          can compensate; tune it there. */}
      <body className="min-h-full flex flex-col" style={{ zoom: "var(--app-zoom)" }}>
        <MockProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </MockProvider>
      </body>
    </html>
  );
}
