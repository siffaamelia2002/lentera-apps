import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // 🔥 TAMBAH INI
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;