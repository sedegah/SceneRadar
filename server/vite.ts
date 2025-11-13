import path from "path";
import fs from "fs";
import express, { Express } from "express";
import { fileURLToPath } from "url";
import { createServer as createViteServer, ViteDevServer } from "vite";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string) {
  console.log(`[LOG] ${message}`);
}

// Used in production only
export function serveStatic(app: Express) {
  const publicPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(path.join(publicPath, "index.html"))) {
    throw new Error("Missing Vite build. Run `vite build` before starting in production.");
  }

  app.use(express.static(publicPath));

  // Fallback for client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

// Used in development only
export async function setupVite(app: Express, server: any) {
  const vite: ViteDevServer = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: path.resolve(__dirname, "../client"),
  });

  app.use(vite.middlewares);
}
