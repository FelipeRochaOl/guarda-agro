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
  token: string | null = null,
): Promise<string> {
  const url = `${API_URL}/api/analysis/history`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
export async function getUserHistory(
  userId: string,
  token: string | null,
): Promise<HistoryEntry[]> {
  const url = `${API_URL}/api/analysis/history?userId=${userId}`;
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
      errorData?.error || `Erro ao buscar histórico (${response.status})`,
    );
  }

  return response.json();
}
