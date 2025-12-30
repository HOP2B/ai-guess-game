import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.wikipedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.wikicommons.org',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'static.dc.com',
      },
      {
        protocol: 'https',
        hostname: 'expresstorussia.com',
      },
      {
        protocol: 'https',
        hostname: '*.expresstorussia.com',
      },
      {
        protocol: 'https',
        hostname: 'imgix.ranker.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgix.ranker.com',
      },
      {
        protocol: 'https',
        hostname: 'static0.moviewebimages.com',
      },
      {
        protocol: 'https',
        hostname: '*.moviewebimages.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.hoopshype.com',
      },
      {
        protocol: 'https',
        hostname: 'sm.pcmag.com',
      },
    ],
  },
};

export default nextConfig;
