import { createBoundingBox } from "../../../utils/geo";

const NASA_FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";

export class NasaFirmsRepository {
  async fetchCsvData(
    latitude: number,
    longitude: number,
    days: number,
    apiKey: string,
    source: string
  ): Promise<string> {
    const boundingBox = createBoundingBox(latitude, longitude);
    const url = `${NASA_FIRMS_BASE_URL}/${apiKey}/${source}/${boundingBox}/${days}`;

    console.log(`[NASA FIRMS Repository] Buscando focos: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[NASA FIRMS Repository] Erro ${response.status}: ${response.statusText}`);
      throw new Error(`Erro ao consultar NASA FIRMS: ${response.status}. Verifique sua API key.`);
    }

    return await response.text();
  }
}
