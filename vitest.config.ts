import { defineConfig } from "vitest/config";
import { config } from "dotenv";

const env = config({ path: ".env.local" }).parsed ?? {};

export default defineConfig({
  test: {
    globals:     true,
    environment: "node",
    reporters:   ["verbose"],
    testTimeout: 30_000,
    include:     ["tests/**/*.test.ts"],
    exclude:     ["tests/07-seed-data.ts", "tests/setup.ts"],
    sequence:    { concurrent: false },
    env: {
      FREELANCER_PASSWORD: env.FREELANCER_PASSWORD ?? "",
      CLIENT_PASSWORD:     env.CLIENT_PASSWORD ?? "",
    },
  },
});
