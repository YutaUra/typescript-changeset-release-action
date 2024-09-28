import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts", "src/config.ts"],
  format: ["esm"],
  target: "node20",
  sourcemap: true,
  clean: true,
});
