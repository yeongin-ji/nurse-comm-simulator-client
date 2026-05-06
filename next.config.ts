import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://34.59.172.47/api/:path*",
    },
  ],
};

export default nextConfig;
