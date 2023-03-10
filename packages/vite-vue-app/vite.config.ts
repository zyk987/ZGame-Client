import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import qiankun from "vite-plugin-qiankun";

export default defineConfig(({ mode }) => ({
  base: mode === "local" ? "/" : "http://localhost:3002/",
  plugins: [
    vue(),
    qiankun("vite-vue-app", {
      // 微应用名字，与主应用注册的微应用名字保持一致
      useDevMode: true,
    }),
  ],
  server: {
    port: 3002,
    origin: "http://localhost:3002",
  },
}));
