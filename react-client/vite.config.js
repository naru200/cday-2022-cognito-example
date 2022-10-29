import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ["COGNITO_", "BACKEND_"],
  server: {
    port: 8080,
  },
});
