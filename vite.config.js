import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  build: {
    lib: { entry: resolve(__dirname, "src/main.js"), name: "hackathon-2024" },
  },
  server: { host: "0.0.0.0", port: 8000 },
  clearScreen: false,
});
