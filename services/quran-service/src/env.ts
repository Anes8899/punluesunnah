import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Loads the nearest `.env` walking up from the working directory — for a
 * service that is its own folder, then the monorepo root — so a plain
 * `npm run dev` works without exporting anything. In Docker the variables come
 * from compose and no file exists, which is fine.
 */
export function loadEnv(): void {
  let dir = process.cwd();
  for (;;) {
    const candidate = join(dir, ".env");
    if (existsSync(candidate)) {
      process.loadEnvFile(candidate);
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable`);
  return value;
}
