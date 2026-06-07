/**
 * GuardaAgro API — Vercel Serverless Entry Point
 * Backend ElysiaJS rodando com Bun no Vercel
 */

import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { analysisRoutes } from "../backend/src/modules/analysis/routes/analysis.routes";
import { nasaRoutes } from "../backend/src/modules/nasa/routes/nasa.routes";

const app = new Elysia()
  // CORS configurado para permitir Vercel e localhost
  .use(
    cors({
      origin: (origin) => {
        // Permite localhost (dev) e qualquer domínio vercel.app (prod)
        if (!origin) return true;
        if (origin.includes("localhost")) return true;
        if (origin.endsWith(".vercel.app")) return true;
        return false;
      },
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    }),
  )
  // Health check
  .get("/health", () => ({
    status: "ok",
    service: "GuardaAgro API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    runtime: "Bun on Vercel",
  }))
  // Rotas da aplicação
  .use(analysisRoutes)
  .use(nasaRoutes);

// Para desenvolvimento local
if (import.meta.env.DEV) {
  const PORT = parseInt(process.env.PORT || "3001");
  app.listen(PORT);
  console.log(`🌿 GuardaAgro API rodando em http://localhost:${PORT}`);
}

// Export para Vercel
export default app;
