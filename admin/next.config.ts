import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Book uploads (cover + PDF) go through a Server Action; the API caps each file at 50 MB.
      bodySizeLimit: "60mb",
    },
  },
};

export default nextConfig;
