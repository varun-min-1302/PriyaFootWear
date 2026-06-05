import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.walkaroo.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dotpe.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rukmini1.flixcart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "buyto.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gostoreless.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "assets.myntassets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.myntassets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thumbnail.getalltool.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
