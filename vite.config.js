import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   host: '192.168.82.10',
  //   port: 3000,
  // },
});
