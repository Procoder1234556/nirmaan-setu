import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 15.2's ESLint runner is incompatible with the project's ESLint 9
  // flat-config toolchain. Linting remains available as an explicit CI check.
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
