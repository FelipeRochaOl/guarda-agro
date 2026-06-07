/**
 * Tipos da análise ambiental — compartilhados com o backend
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Period {
  start: string;
  end: string;
}

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

export type RiskLevel = "Baixo" | "Médio" | "Alto" | "Crítico";

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  location: Location;
  period: Period;
  climate: ClimateData;
  fires: FireData[];
  risk: RiskAssessment;
  firmsMessage?: string;
}

export interface HistoryEntry {
  id?: string;
  userId: string;
  result: AnalysisResult;
  createdAt: string;
  locationLabel?: string;
}
