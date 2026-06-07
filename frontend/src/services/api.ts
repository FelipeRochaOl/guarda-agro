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
): Promise<AnalysisResult> {
  const url = `${API_URL}/api/analysis?latitude=${latitude}&longitude=${longitude}&days=${days}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ||
        `Erro ao conectar com o servidor (${response.status})`,
    );
  }

  return response.json();
}

/**
 * Busca dados climáticos da NASA POWER
 */
export async function fetchNasaPower(
  latitude: number,
  longitude: number,
  start: string,
  end: string,
) {
  const url = `${API_URL}/api/nasa/power?latitude=${latitude}&longitude=${longitude}&start=${start}&end=${end}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da NASA POWER");
  }

  return response.json();
}

/**
 * Busca focos de calor da NASA FIRMS
 */
export async function fetchNasaFirms(
  latitude: number,
  longitude: number,
  days: number,
) {
  const url = `${API_URL}/api/nasa/firms?latitude=${latitude}&longitude=${longitude}&days=${days}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da NASA FIRMS");
  }

  return response.json();
}

/**
 * Verifica saúde da API
 */
export async function checkHealth() {
  const url = `${API_URL}/health`;
  const response = await fetch(url);
  return response.json();
}
