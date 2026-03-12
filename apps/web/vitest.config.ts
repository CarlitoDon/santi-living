import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@scripts": path.resolve(__dirname, "src/scripts"),
      "@data": path.resolve(__dirname, "src/data"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
  test: {
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/**/*.ts",
        "src/scripts/form-validation.ts",
        "src/scripts/geolocation.ts",
        "src/services/address-matcher.ts",
      ],
      thresholds: {
        "src/lib/domain/rental.ts": {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
        "src/lib/format.ts": {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
        "src/lib/calculator-logic.ts": {
          statements: 95,
          branches: 95,
          functions: 90,
          lines: 95,
        },
        "src/services/address-matcher.ts": {
          statements: 85,
          branches: 75,
          functions: 100,
          lines: 90,
        },
      },
    },
  },
});
