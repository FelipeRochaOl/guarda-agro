/**
 * GuardaAgro Backend — Entry Point
 * Servidor ElysiaJS com integração NASA POWER e FIRMS
 *
 * Rotas:
 * - GET /health — Status da API
 * - GET /api/analysis — Análise ambiental completa
 * - GET /api/nasa/power — Dados climáticos da NASA POWER
 * - GET /api/nasa/firms — Focos de calor da NASA FIRMS
 */

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { analysisRoutes } from "./modules/analysis/routes/analysis.routes";
import { nasaRoutes } from "./modules/nasa/routes/nasa.routes";

const PORT = parseInt(process.env.PORT || "3001");
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const app = new Elysia()
  // CORS configurado para o frontend
  .use(
    cors({
      origin: CORS_ORIGIN,
      methods: ["GET", "OPTIONS"],
      credentials: true,
    })
  )
  // Health check
  .get("/health", () => ({
    status: "ok",
    service: "GuardaAgro API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }))
  // Rotas da aplicação (Módulos)
  .use(analysisRoutes)
  .use(nasaRoutes)
  // Inicia o servidor
  .listen(PORT);

console.log(`
╔══════════════════════════════════════════════╗
║          🌿 GuardaAgro API v1.0.0           ║
║══════════════════════════════════════════════║
║  Status:  Rodando                           ║
║  Porta:   ${String(PORT).padEnd(35)}║
║  CORS:    ${CORS_ORIGIN.padEnd(35)}║
║  FIRMS:   ${(process.env.NASA_FIRMS_API_KEY ? "Configurado ✅" : "Não configurado ⚠️").padEnd(35)}║
╚══════════════════════════════════════════════╝
`);

export type App = typeof app;
