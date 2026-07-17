import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  env: {
    // Inlined at build time so the version chip needs no runtime lookup.
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      // 로컬 백엔드로 프록시하려면 API_PROXY_TARGET=http://localhost:8080 등으로 실행
      destination: `${process.env.API_PROXY_TARGET ?? "http://34.64.243.12"}/api/:path*`,
    },
  ],
};

export default nextConfig;
