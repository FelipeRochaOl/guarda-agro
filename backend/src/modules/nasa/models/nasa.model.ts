export interface ClimateData {
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  solarRadiation: number;
}

export interface FireData {
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: string;
  acqDate: string;
  acqTime: string;
  satellite: string;
}

export interface NasaPowerResponse {
  properties: {
    parameter: {
      [key: string]: {
        [date: string]: number;
      };
    };
  };
}

export interface FirmsApiResponse {
  fires: FireData[];
  message?: string;
}
