import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "dist/index.cjs",
  sourcemap: true,
  external: ["pg-native", "pino-pretty", "thread-stream", "pino"],
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
});
