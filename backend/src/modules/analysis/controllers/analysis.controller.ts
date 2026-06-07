import { isValidDays } from "../../../utils/date";
import { isValidLatitude, isValidLongitude } from "../../../utils/geo";
import { AnalysisService } from "../services/analysis.service";

export class AnalysisController {
  private service: AnalysisService;

  constructor() {
    this.service = new AnalysisService();
  }

  /**
   * Lida com a requisição de análise completa
   */
  async getAnalysis(
    query: { latitude: string; longitude: string; days: string },
    set: any,
  ) {
    const latitude = parseFloat(query.latitude);
    const longitude = parseFloat(query.longitude);
    const days = parseInt(query.days);

    // Validações
    if (!isValidLatitude(latitude)) {
      set.status = 400;
      return { error: "Latitude inválida. Use um valor entre -90 e 90." };
    }

    if (!isValidLongitude(longitude)) {
      set.status = 400;
      return { error: "Longitude inválida. Use um valor entre -180 e 180." };
    }

    if (!isValidDays(days)) {
      set.status = 400;
      return { error: "Período inválido. Use 1, 3 ou 7 dias." };
    }

    try {
      return await this.service.runAnalysis(latitude, longitude, days);
    } catch (error) {
      console.error("[Analysis Controller] Erro durante análise:", error);
      set.status = 500;
      return {
        error: "Erro interno ao processar análise ambiental. Tente novamente.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Salva uma análise no histórico do usuário
   */
  async saveHistory(
    body: { userId: string; result: any; locationLabel?: string },
    set: any,
  ) {
    const { userId, result, locationLabel } = body;

    if (!userId || !result) {
      set.status = 400;
      return { error: "userId e result são obrigatórios." };
    }

    try {
      const id = await this.service.saveHistory(userId, result, locationLabel);
      return { success: true, id };
    } catch (error) {
      console.error("[Analysis Controller] Erro ao salvar histórico:", error);
      set.status = 500;
      return {
        error: "Erro ao salvar análise no histórico.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Recupera o histórico de análises do usuário
   */
  async getHistory(query: { userId: string }, set: any) {
    const { userId } = query;

    if (!userId) {
      set.status = 400;
      return { error: "userId é obrigatório." };
    }

    try {
      const history = await this.service.getHistory(userId);
      return history;
    } catch (error) {
      console.error("[Analysis Controller] Erro ao buscar histórico:", error);
      set.status = 500;
      return {
        error: "Erro ao recuperar histórico de análises.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }
}
