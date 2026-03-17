import { dirname } from "path";
import { fileURLToPath } from "url";
import fromJson from "eslint-config-next/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = fromJson(__dirname);

const eslintConfig = {
  ...nextConfig,
  // Override default ignores of eslint-config-next.
  ignores: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
};

export default eslintConfig;
