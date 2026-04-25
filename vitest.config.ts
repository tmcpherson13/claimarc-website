import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // jsdom optionally tries to load `canvas`; the native binary is not
      // available in CI/sandbox, so stub it out.
      canvas: path.resolve(__dirname, "./src/test/canvas-stub.cjs"),
    },
  },
});
