import { calculatePeriod } from "../../../utils/date";
import { NasaFirmsService } from "../../nasa/services/nasaFirms.service";
import { NasaPowerService } from "../../nasa/services/nasaPower.service";
import type { AnalysisResult } from "../models/analysis.model";
import {
  AnalysisRepository,
  type HistoryEntry,
} from "../repositories/analysis.repository";
import { RiskService } from "./risk.service";

export class AnalysisService {
  private powerService: NasaPowerService;
  private firmsService: NasaFirmsService;
  private riskService: RiskService;
  private repository: AnalysisRepository;

  constructor() {
    this.powerService = new NasaPowerService();
    this.firmsService = new NasaFirmsService();
    this.riskService = new RiskService();
    this.repository = new AnalysisRepository();
  }

  /**
   * Executa a análise ambiental completa
   */
  async runAnalysis(
    latitude: number,
    longitude: number,
    days: number,
  ): Promise<AnalysisResult & { firmsMessage?: string }> {
    // Calcula período retroativo
    const period = calculatePeriod(days);
    if (days > 5) days = 5; // Limite máximo para evitar sobrecarga na NASA POWER

    // Busca dados em paralelo para melhor performance
    const [climate, firmsResult] = await Promise.all([
      this.powerService.getClimateData(
        latitude,
        longitude,
        period.start,
        period.end,
      ),
      this.firmsService.getFireData(latitude, longitude, days),
    ]);

    // Calcula risco ambiental
    const risk = this.riskService.calculateRisk(climate, firmsResult.fires);

    const result: AnalysisResult & { firmsMessage?: string } = {
      location: { latitude, longitude },
      period,
      climate,
      fires: firmsResult.fires,
      risk,
    };

    // Inclui mensagem do FIRMS se houver (ex: API key faltando)
    if (firmsResult.message) {
      result.firmsMessage = firmsResult.message;
    }

    return result;
  }

  /**
   * Salva uma análise no histórico do usuário
   */
  async saveHistory(
    userId: string,
    result: AnalysisResult,
    locationLabel?: string,
  ): Promise<string> {
    return this.repository.saveAnalysis(userId, result, locationLabel);
  }

  /**
   * Recupera o histórico de análises do usuário
   */
  async getHistory(userId: string): Promise<HistoryEntry[]> {
    return this.repository.getUserHistory(userId);
  }
}
