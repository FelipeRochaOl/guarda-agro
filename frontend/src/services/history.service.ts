/**
 * Serviço de Histórico — Salva e recupera análises via Backend
 */

import type { AnalysisResult, HistoryEntry } from "../types/analysis";

// Em produção (Vercel), usa paths relativos. Em dev local, usa localhost:3001
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:3001");

/**
 * Salva uma análise no histórico via Backend
 */
export async function saveAnalysis(
  userId: string,
  result: AnalysisResult,
  locationLabel?: string,
): Promise<string> {
  const url = `${API_URL}/api/analysis/history`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      result,
      locationLabel:
        locationLabel ||
        `${result.location.latitude}, ${result.location.longitude}`,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Erro ao salvar análise (${response.status})`,
    );
  }

  const data = await response.json();
  return data.id;
}

/**
 * Busca as últimas análises do usuário via Backend
 */
export async function getUserHistory(userId: string): Promise<HistoryEntry[]> {
  const url = `${API_URL}/api/analysis/history?userId=${userId}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Erro ao buscar histórico (${response.status})`,
    );
  }

  return response.json();
}

/**
 * Busca uma análise específica pelo ID (não implementado no backend ainda)
 * Mantido para compatibilidade
 */
export async function getAnalysisById(
  analysisId: string,
): Promise<HistoryEntry | null> {
  console.warn("[History Service] getAnalysisById não implementado no backend");
  return null;
}
