import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    // Proxy API calls to Supabase Edge Functions in dev
    proxy: {
      "/functions/v1": {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        headers: {
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        },
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
