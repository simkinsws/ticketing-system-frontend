import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    hmr: {
      protocol: "wss",
      host: "localhost",
      port: 5173,
    },
    watch: {
      usePolling: true, // Force file watching
    },
    proxy: {
      "/hubs/support": {
        target: "https://localhost:54166",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  preview: {
    port: 5173,
    proxy: {
      "/hubs/support": {
        target: "https://localhost:54166",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
