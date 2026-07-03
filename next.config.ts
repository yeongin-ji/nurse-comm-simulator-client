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
      destination: "http://34.64.243.12/api/:path*",
    },
  ],
};

export default nextConfig;
