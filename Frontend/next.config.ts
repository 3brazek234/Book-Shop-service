import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      new URL('https://placehold.co/**'),
      new URL('https://m.media-amazon.com/images/I/**'),
      new URL('https://images-na.ssl-images-amazon.com/images/I/**')
    ],
  },
};

export default nextConfig;
