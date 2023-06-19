import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import qiankun from "vite-plugin-qiankun";
import reactRefresh from "@vitejs/plugin-react-refresh";

const useDevMode = true;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(useDevMode ? [] : [reactRefresh()]),
    qiankun("2048", {
      useDevMode: true,
    }),
  ],
  server: {
    port: 3001,
  },
});
