import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:url";

// Load .env
if (existsSync(".env")) {
  const envContent = readFileSync(".env", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  }
}

const PORT = Number(process.env.APP_PORT) || 3000;

console.log(`Starting Delcom Cash Flow application on port ${PORT}...`);

import("./.output/server/index.mjs")
  .then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });

