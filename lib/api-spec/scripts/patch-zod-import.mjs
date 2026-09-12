import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiZodFile = path.resolve(__dirname, "..", "..", "lib", "api-zod", "src", "generated", "api.ts");

try {
  const content = readFileSync(apiZodFile, "utf8");
  const patched = content.replace(
    "import * as zod from 'zod';",
    "import * as zod from 'zod/v4';",
  );
  if (patched !== content) {
    writeFileSync(apiZodFile, patched, "utf8");
    console.log("Patched api-zod generated import to use zod/v4.");
  }
} catch (err) {
  console.error("Failed to patch api-zod generated import:", err);
}