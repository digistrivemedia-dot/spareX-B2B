import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Return and job-card photos are sent with the form, resized to about 150 KB each.
    serverActions: { bodySizeLimit: "4mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
