import { db } from "../../../config/firebase";
import type { AnalysisResult } from "../models/analysis.model";

export interface HistoryEntry {
  id: string;
  userId: string;
  result: AnalysisResult;
  createdAt: string;
  locationLabel: string;
}

const COLLECTION_NAME = "analyses";

/**
 * Repository de Análise com integração ao Firestore
 */
export class AnalysisRepository {
  /**
   * Salva uma análise no Firestore associada ao usuário
   */
  async saveAnalysis(
    userId: string,
    result: AnalysisResult,
    locationLabel?: string,
  ): Promise<string> {
    try {
      const docRef = await db.collection(COLLECTION_NAME).add({
        userId,
        result,
        locationLabel:
          locationLabel ||
          `${result.location.latitude}, ${result.location.longitude}`,
        createdAt: new Date().toISOString(),
      });

      console.log(
        `[Analysis Repository] Análise salva com ID: ${docRef.id} para user: ${userId}`,
      );
      return docRef.id;
    } catch (error) {
      console.error("[Analysis Repository] Erro ao salvar análise:", error);
      throw new Error("Falha ao salvar análise no Firestore");
    }
  }

  /**
   * Busca as últimas análises do usuário (máximo 20)
   */
  async getUserHistory(userId: string): Promise<HistoryEntry[]> {
    try {
      const snapshot = await db
        .collection(COLLECTION_NAME)
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      const entries: HistoryEntry[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          userId: data.userId,
          result: data.result,
          createdAt: data.createdAt,
          locationLabel: data.locationLabel,
        });
      });

      console.log(
        `[Analysis Repository] ${entries.length} análises recuperadas para user: ${userId}`,
      );
      return entries;
    } catch (error) {
      console.error("[Analysis Repository] Erro ao buscar histórico:", error);
      return [];
    }
  }
}
