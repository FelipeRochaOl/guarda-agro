import type { ClimateData } from "../models/nasa.model";
import { NasaPowerRepository } from "../repositories/nasaPower.repository";

/** Parâmetros climáticos solicitados à API */
const PARAMETERS = [
  "T2M",              // Temperatura média a 2m (°C)
  "T2M_MAX",          // Temperatura máxima a 2m (°C)
  "T2M_MIN",          // Temperatura mínima a 2m (°C)
  "RH2M",             // Umidade relativa a 2m (%)
  "PRECTOTCORR",      // Precipitação total corrigida (mm/dia)
  "WS2M",             // Velocidade do vento a 2m (m/s)
  "ALLSKY_SFC_SW_DWN", // Radiação solar incidente (kWh/m²/dia)
].join(",");

export class NasaPowerService {
  private repository: NasaPowerRepository;

  constructor() {
    this.repository = new NasaPowerRepository();
  }

  /**
   * Calcula a média de um objeto de valores diários da NASA POWER
   * Ignora valores inválidos (-999)
   */
  private calculateAverage(dailyValues: Record<string, number>): number {
    const values = Object.values(dailyValues).filter((v) => v !== -999);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / values.length) * 100) / 100;
  }

  /**
   * Busca dados climáticos da NASA POWER API
   */
  async getClimateData(
    latitude: number,
    longitude: number,
    start: string,
    end: string
  ): Promise<ClimateData> {
    const data = await this.repository.fetchRawData(latitude, longitude, start, end, PARAMETERS);
    const params = data.properties.parameter;

    const climate: ClimateData = {
      temperature: this.calculateAverage(params.T2M || {}),
      temperatureMax: this.calculateAverage(params.T2M_MAX || {}),
      temperatureMin: this.calculateAverage(params.T2M_MIN || {}),
      humidity: this.calculateAverage(params.RH2M || {}),
      precipitation: this.calculateAverage(params.PRECTOTCORR || {}),
      windSpeed: this.calculateAverage(params.WS2M || {}),
      solarRadiation: this.calculateAverage(params.ALLSKY_SFC_SW_DWN || {}),
    };

    console.log(`[NASA POWER Service] Dados obtidos com sucesso:`, climate);
    return climate;
  }

  /**
   * Retorna dados brutos (séries diárias) da NASA POWER API
   */
  async getRawClimateData(
    latitude: number,
    longitude: number,
    start: string,
    end: string
  ): Promise<Record<string, Record<string, number>>> {
    const data = await this.repository.fetchRawData(latitude, longitude, start, end, PARAMETERS);
    return data.properties.parameter;
  }
}
