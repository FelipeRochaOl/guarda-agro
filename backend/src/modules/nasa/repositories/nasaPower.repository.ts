import type { NasaPowerResponse } from "../models/nasa.model";

const NASA_POWER_BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point";

export class NasaPowerRepository {
  async fetchRawData(
    latitude: number,
    longitude: number,
    start: string,
    end: string,
    parameters: string
  ): Promise<NasaPowerResponse> {
    const url = `${NASA_POWER_BASE_URL}?parameters=${parameters}&community=AG&longitude=${longitude}&latitude=${latitude}&start=${start}&end=${end}&format=JSON`;

    console.log(`[NASA POWER Repository] Buscando dados: lat=${latitude}, lng=${longitude}, ${start}-${end}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NASA POWER Repository] Erro ${response.status}: ${errorText}`);
      throw new Error(`Erro ao acessar NASA POWER API: ${response.status} — ${response.statusText}`);
    }

    return (await response.json()) as NasaPowerResponse;
  }
}
