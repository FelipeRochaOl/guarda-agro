import type { RiskAssessment, RiskLevel } from "../models/analysis.model";
import type { ClimateData, FireData } from "../../nasa/models/nasa.model";

export class RiskService {
  /**
   * Classifica o nível de risco baseado no score
   */
  private classifyRisk(score: number): RiskLevel {
    if (score >= 80) return "Crítico";
    if (score >= 60) return "Alto";
    if (score >= 35) return "Médio";
    return "Baixo";
  }

  /**
   * Gera recomendações baseadas no nível de risco e fatores identificados
   */
  private generateRecommendations(level: RiskLevel, factors: string[]): string[] {
    const recommendations: string[] = [];

    if (level === "Crítico") {
      recommendations.push("⚠️ Alerta máximo: Acione defesa civil e corpo de bombeiros imediatamente.");
      recommendations.push("Suspenda atividades agrícolas ao ar livre.");
      recommendations.push("Monitore a região continuamente nas próximas horas.");
    }

    if (level === "Alto") {
      recommendations.push("Mantenha vigilância reforçada na região.");
      recommendations.push("Prepare planos de contingência para emergências ambientais.");
    }

    if (factors.some((f) => f.includes("Temperatura"))) {
      recommendations.push("Garanta hidratação adequada para trabalhadores rurais e animais.");
      recommendations.push("Considere irrigação de emergência para culturas sensíveis.");
    }

    if (factors.some((f) => f.includes("Umidade"))) {
      recommendations.push("Atenção redobrada para risco de incêndios florestais.");
      recommendations.push("Evite queimadas controladas neste período.");
    }

    if (factors.some((f) => f.includes("Precipitação"))) {
      recommendations.push("Implemente técnicas de conservação de água.");
      recommendations.push("Monitore reservatórios e nascentes da região.");
    }

    if (factors.some((f) => f.includes("Vento"))) {
      recommendations.push("Proteja estruturas agrícolas contra ventos fortes.");
      recommendations.push("Risco elevado de propagação rápida de incêndios.");
    }

    if (factors.some((f) => f.includes("focos de calor"))) {
      recommendations.push("Verifique pontos de calor detectados e acione brigadas se necessário.");
    }

    if (level === "Baixo") {
      recommendations.push("Condições ambientais favoráveis. Mantenha monitoramento de rotina.");
    }

    return recommendations;
  }

  /**
   * Calcula o índice de risco ambiental (0-100) baseado em dados climáticos e focos de calor
   */
  calculateRisk(climate: ClimateData, fires: FireData[]): RiskAssessment {
    let score = 0;
    const factors: string[] = [];

    // Temperatura alta (> 32°C)
    if (climate.temperature > 32) {
      score += 20;
      factors.push(`Temperatura elevada: ${climate.temperature}°C (acima de 32°C)`);
    }

    // Umidade baixa (< 35%)
    if (climate.humidity < 35) {
      score += 20;
      factors.push(`Umidade crítica: ${climate.humidity}% (abaixo de 35%)`);
    }

    // Precipitação baixa (< 2mm)
    if (climate.precipitation < 2) {
      score += 20;
      factors.push(`Precipitação insuficiente: ${climate.precipitation}mm (abaixo de 2mm)`);
    }

    // Vento forte (> 20 km/h = ~5.56 m/s)
    const windSpeedKmh = climate.windSpeed * 3.6;
    if (windSpeedKmh > 20) {
      score += 15;
      factors.push(`Vento forte: ${windSpeedKmh.toFixed(1)} km/h (acima de 20 km/h)`);
    }

    // Radiação solar alta (> 5 kWh/m²/dia)
    if (climate.solarRadiation > 5) {
      score += 10;
      factors.push(`Radiação solar intensa: ${climate.solarRadiation} kWh/m²/dia (acima de 5)`);
    }

    // Focos de calor (+5 por foco, máximo +15)
    if (fires.length > 0) {
      const fireScore = Math.min(fires.length * 5, 15);
      score += fireScore;
      factors.push(`${fires.length} foco(s) de calor detectado(s) na região (+${fireScore} pontos)`);
    }

    // Garante que o score fique entre 0 e 100
    score = Math.min(Math.max(score, 0), 100);

    const level = this.classifyRisk(score);
    const recommendations = this.generateRecommendations(level, factors);

    return {
      score,
      level,
      factors,
      recommendations,
    };
  }
}
