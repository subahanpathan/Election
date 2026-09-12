import fs from "node:fs";
import path from "node:path";

function loadEnvFile(): void {
  const candidates: string[] = [];

  // Walk up from the current working directory looking for .env
  let cwd = process.cwd();
  for (let i = 0; i < 5; i++) {
    candidates.push(path.resolve(cwd, ".env"));
    cwd = path.dirname(cwd);
  }

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
    break;
  }
}

function requireSecret(envVar: string): string {
  const value = process.env[envVar];
  if (!value || value.length < 16) {
    throw new Error(
      `${envVar} environment variable is required and must be at least 16 characters long. ` +
        `Set it in the .env file at the project root before starting the server.`,
    );
  }
  return value;
}

loadEnvFile();

requireSecret("SESSION_SECRET");
requireSecret("DATABASE_URL");