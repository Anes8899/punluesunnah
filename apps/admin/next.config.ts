import type { NextConfig } from "next";
import path from "node:path";

// Next only reads .env from its own folder; the monorepo keeps one at the
// root, injected by the `dotenv -e ../../.env` prefix in package.json scripts.
const monorepoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  // Self-contained build for the Docker image (see apps/admin/Dockerfile).
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
