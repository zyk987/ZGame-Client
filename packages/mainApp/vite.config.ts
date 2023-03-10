import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      config: resolve(__dirname, "./config"),
      utils: resolve(__dirname, "./src/utils"),
      assets: resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    port: 3000,
  },
});
