import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/pathways/" : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      input: {
        index: "index.html",
        test: "test.html",
      },
    },
  },
});
