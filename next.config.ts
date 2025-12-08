import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },

  // allow build even if TypeScript has errors
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    // TURN THIS OFF to stop router.push & route type errors
    typedRoutes: false,
  },
};

export default nextConfig;
