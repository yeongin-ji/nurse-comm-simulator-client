import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://34.64.243.12/api/:path*",
    },
  ],
};

export default nextConfig;
