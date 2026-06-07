import type { ClimateData, FireData } from "../../nasa/models/nasa.model";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Period {
  start: string; // YYYYMMDD
  end: string;   // YYYYMMDD
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
}
