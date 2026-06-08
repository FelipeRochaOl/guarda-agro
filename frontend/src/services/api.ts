/**
 * Serviço de API — Cliente HTTP para o backend GuardaAgro
 */

import type { AnalysisResult } from "../types/analysis";

// Em produção (Vercel), usa paths relativos. Em dev local, usa localhost:3001
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:3001");

/**
 * Executa análise ambiental completa
 */
export async function fetchAnalysis(
  latitude: number,
  longitude: number,
  days: number,
  token: string | null,
): Promise<AnalysisResult> {
  const url = `${API_URL}/api/analysis?latitude=${latitude}&longitude=${longitude}&days=${days}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("401 Unauthorized - Token inválido ou expirado");
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ||
        `Erro ao conectar com o servidor (${response.status})`,
    );
  }

  return response.json();
}
