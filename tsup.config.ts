import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["cjs"],
  target: "node20",
  sourcemap: true,
  clean: true,
  noExternal: [/.*/],
  external: [/^node:.*/],
});
