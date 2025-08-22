import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures assets are loaded from root
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
});
