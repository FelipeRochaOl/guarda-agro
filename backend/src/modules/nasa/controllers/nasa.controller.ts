import { isValidDays } from "../../../utils/date";
import { isValidLatitude, isValidLongitude } from "../../../utils/geo";
import { NasaFirmsService } from "../services/nasaFirms.service";
import { NasaPowerService } from "../services/nasaPower.service";

export class NasaController {
  private powerService: NasaPowerService;
  private firmsService: NasaFirmsService;

  constructor() {
    this.powerService = new NasaPowerService();
    this.firmsService = new NasaFirmsService();
  }

  async getPowerData(
    query: { latitude: string; longitude: string; start: string; end: string },
    set: any,
  ) {
    const latitude = parseFloat(query.latitude);
    const longitude = parseFloat(query.longitude);
    const { start, end } = query;

    if (!isValidLatitude(latitude)) {
      set.status = 400;
      return { error: "Latitude inválida. Use um valor entre -90 e 90." };
    }
    if (!isValidLongitude(longitude)) {
      set.status = 400;
      return { error: "Longitude inválida. Use um valor entre -180 e 180." };
    }
    if (!start || !end || start.length !== 8 || end.length !== 8) {
      set.status = 400;
      return { error: "Datas inválidas. Use o formato YYYYMMDD." };
    }

    try {
      const [climate, rawData] = await Promise.all([
        this.powerService.getClimateData(latitude, longitude, start, end),
        this.powerService.getRawClimateData(latitude, longitude, start, end),
      ]);

      return {
        location: { latitude, longitude },
        period: { start, end },
        climate,
        dailyData: rawData,
      };
    } catch (error) {
      console.error("[NASA POWER Controller] Erro:", error);
      set.status = 500;
      return {
        error: "Erro ao buscar dados da NASA POWER API.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  async getFirmsData(
    query: { latitude: string; longitude: string; days: string },
    set: any,
  ) {
    const latitude = parseFloat(query.latitude);
    const longitude = parseFloat(query.longitude);
    const days = parseInt(query.days);

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
      const result = await this.firmsService.getFireData(
        latitude,
        longitude,
        days,
      );

      return {
        location: { latitude, longitude },
        days,
        totalFires: result.fires.length,
        fires: result.fires,
        message: result.message,
      };
    } catch (error) {
      console.error("[NASA FIRMS Controller] Erro:", error);
      set.status = 500;
      return {
        error: "Erro ao buscar dados da NASA FIRMS API.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }
}
