import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// These modules won't be bundled as part of the Vite build of the Electron (main) side,
// but they'll be included in the final Electron app build inside the asar file.
const electronExternalModules = ["node-llama-cpp", "lifecycle-utils", "llamaindex", "playwright"];

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    target: "es2022"
  },
  optimizeDeps: {
    exclude: electronExternalModules,
    esbuildOptions: {
      target: "es2022"
    }
  },
  build: {
    // Make sure the Vite renderer process outputs to "dist", which should match your Electron main process.
    outDir: path.join(__dirname, "dist"),
    target: "es2022",
    rollupOptions: {
      input: path.join(__dirname, "src/index.html"), // Specify your entry HTML file
    }
  },
  root: path.join(__dirname, "src"), // Entry point for the renderer process
  publicDir: path.join(__dirname, "public"), // Where public assets are stored
  plugins: [
    react(),
    svgr(),
    electron({
      main: {
        entry: path.join(__dirname, "electron/index.ts"),
        vite: {
          build: {
            target: "es2022",
            outDir: path.join(__dirname, "dist-electron"),
            rollupOptions: {
              external: electronExternalModules,
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, "electron/preload.ts"),
        vite: {
          build: {
            target: "es2022",
            outDir: path.join(__dirname, "dist-electron"),
          },
        },
      },
      renderer: process.env.NODE_ENV === "test" ? undefined : {},
    }),
  ],
});
