import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@near-js/jsonrpc-react-query": path.resolve(
        "../../packages/jsonrpc-react-query/src"
      ),
      "@near-js/jsonrpc-client": path.resolve(
        "../../packages/jsonrpc-client/src"
      ),
      "@near-js/jsonrpc-types": path.resolve(
        "../../packages/jsonrpc-types/src"
      ),
    },
  },
});
