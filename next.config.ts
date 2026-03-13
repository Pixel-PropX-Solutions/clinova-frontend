import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: 'null-loader', // Ignore .map files
    });
    return config;
  },
};

export default nextConfig;
