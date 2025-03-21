import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**", // Allows all images from placehold.co
      },
      // Add additional remote patterns as needed
      // Example:
      // {
      //   protocol: "https",
      //   hostname: "images.unsplash.com",
      //   pathname: "/**",
      // },
    ],
    // Image optimization configuration
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds minimum
    dangerouslyAllowSVG: false, // Set to true only if you need SVG optimization
    contentDispositionType: 'inline',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Image sizes for srcset
  },
  // Enable experimental image optimization features
  experimental: {
    // Empty experimental section
  },
};

export default nextConfig;
