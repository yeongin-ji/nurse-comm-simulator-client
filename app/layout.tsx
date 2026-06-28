import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query/provider";
import { MockProvider } from "@/lib/mocks/init";
import { Toaster } from "@/components/ui/toaster";

// Pretendard (UI sans) is loaded via @font-face in globals.css.
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
    <html lang="ko" className={`${jetbrainsMono.variable} h-full`}>
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
