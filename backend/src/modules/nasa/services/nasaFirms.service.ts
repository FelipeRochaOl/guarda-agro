import type { FireData, FirmsApiResponse } from "../models/nasa.model";
import { NasaFirmsRepository } from "../repositories/nasaFirms.repository";

export class NasaFirmsService {
  private repository: NasaFirmsRepository;

  constructor() {
    this.repository = new NasaFirmsRepository();
  }

  /**
   * Faz parse de uma linha CSV retornada pela FIRMS API
   */
  private parseCsvLine(line: string, headers: string[]): FireData | null {
    const values = line.split(",");
    if (values.length < headers.length) return null;

    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim() || "";
    });

    const latitude = parseFloat(record["latitude"]);
    const longitude = parseFloat(record["longitude"]);
    const brightness = parseFloat(record["bright_ti4"] || record["brightness"]);

    if (isNaN(latitude) || isNaN(longitude)) return null;

    return {
      latitude,
      longitude,
      brightness: isNaN(brightness) ? 0 : brightness,
      confidence: record["confidence"] || "N/A",
      acqDate: record["acq_date"] || "",
      acqTime: record["acq_time"] || "",
      satellite: record["satellite"] || record["instrument"] || "N/A",
    };
  }

  /**
   * Busca focos de calor da NASA FIRMS API
   */
  async getFireData(
    latitude: number,
    longitude: number,
    days: number
  ): Promise<FirmsApiResponse> {
    const apiKey = process.env.NASA_FIRMS_API_KEY;
    const source = process.env.NASA_FIRMS_SOURCE || "VIIRS_SNPP_NRT";

    // Fallback amigável se a chave não estiver configurada
    if (!apiKey || apiKey.trim() === "") {
      console.warn("[NASA FIRMS Service] API key não configurada. Retornando dados vazios.");
      return {
        fires: [],
        message:
          "NASA FIRMS API key não configurada. Dados de focos de calor indisponíveis no momento.",
      };
    }

    try {
      const csvText = await this.repository.fetchCsvData(latitude, longitude, days, apiKey, source);
      const lines = csvText.trim().split("\n");

      if (lines.length <= 1) {
        console.log("[NASA FIRMS Service] Nenhum foco de calor encontrado na região.");
        return { fires: [] };
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const fires: FireData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const fire = this.parseCsvLine(lines[i], headers);
        if (fire) fires.push(fire);
      }

      console.log(`[NASA FIRMS Service] ${fires.length} foco(s) de calor encontrado(s).`);
      return { fires };
    } catch (error) {
      console.error("[NASA FIRMS Service] Erro na requisição:", error);
      return {
        fires: [],
        message: error instanceof Error ? error.message : "Erro ao consultar NASA FIRMS API. Tente novamente mais tarde.",
      };
    }
  }
}
