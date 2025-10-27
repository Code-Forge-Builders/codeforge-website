import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['placehold.co', 'avatars.githubusercontent.com'],
  },
};

export default withNextIntl(nextConfig);
