/**
 * HistoryPanel — Painel de histórico de análises salvas no Firestore
 */

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Spinner,
  Button,
} from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";
import { getUserHistory } from "../services/history.service";
import type { HistoryEntry, AnalysisResult, RiskLevel } from "../types/analysis";

interface HistoryPanelProps {
  onSelectAnalysis: (result: AnalysisResult) => void;
  refreshTrigger?: number;
}

function getRiskChipColor(level: RiskLevel): "success" | "warning" | "danger" | "default" {
  switch (level) {
    case "Baixo": return "success";
    case "Médio": return "warning";
    case "Alto": return "danger";
    case "Crítico": return "danger";
    default: return "default";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPanel({
  onSelectAnalysis,
  refreshTrigger,
}: HistoryPanelProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const entries = await getUserHistory(user.uid);
      setHistory(entries);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      setError("Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user, refreshTrigger]);

  return (
    <Card className="ga-card border-0">
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="ga-section-title text-white">Histórico</h2>
          </div>
          <Button
            size="sm"
            variant="flat"
            onPress={loadHistory}
            isLoading={loading}
            className="text-slate-400"
          >
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <Divider className="bg-white/5 mt-3" />
      <CardBody className="px-4 pb-4 max-h-[400px] overflow-y-auto">
        {loading && history.length === 0 && (
          <div className="flex justify-center py-8">
            <Spinner size="lg" color="primary" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400 text-center py-4">{error}</p>
        )}

        {!loading && history.length === 0 && !error && (
          <div className="text-center py-8 text-slate-400">
            <span className="text-4xl block mb-3">📭</span>
            <p className="font-medium">Nenhuma análise salva</p>
            <p className="text-sm mt-1">
              Suas análises aparecerão aqui após a primeira consulta.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelectAnalysis(entry.result)}
              className="w-full text-left p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  📍 {entry.locationLabel}
                </span>
                <Chip
                  size="sm"
                  variant="flat"
                  color={getRiskChipColor(entry.result.risk.level)}
                >
                  {entry.result.risk.level} ({entry.result.risk.score})
                </Chip>
              </div>
              <p className="text-xs text-slate-500">
                {formatDate(entry.createdAt)}
              </p>
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
