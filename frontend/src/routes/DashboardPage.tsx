/**
 * DashboardPage — Painel principal do GuardaAgro
 * Integra formulário, resultados, gráficos e histórico
 */

import { Card, CardBody, Chip, Spinner } from "@heroui/react";
import { useCallback, useState } from "react";
import AnalysisForm from "../components/AnalysisForm";
import AppNavbar from "../components/AppNavbar";
import ClimateCards from "../components/ClimateCards";
import ClimateChart from "../components/ClimateChart";
import FireTable from "../components/FireTable";
import HistoryPanel from "../components/HistoryPanel";
import RiskGauge from "../components/RiskGauge";
import { useAuth } from "../contexts/AuthContext";
import { fetchAnalysis } from "../services/api";
import { saveAnalysis } from "../services/history.service";
import type { AnalysisResult } from "../types/analysis";

export default function DashboardPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleAnalysis = useCallback(
    async (latitude: number, longitude: number, days: number) => {
      setIsLoading(true);
      setError("");
      setResult(null);

      try {
        const data = await fetchAnalysis(latitude, longitude, days);
        setResult(data);

        // Salvar no histórico do Firestore
        if (user) {
          try {
            await saveAnalysis(user.uid, data);
            setRefreshHistory((prev) => prev + 1);
          } catch (saveErr) {
            console.warn("Não foi possível salvar no histórico:", saveErr);
          }
        }
      } catch (err: any) {
        console.error("Erro na análise:", err);
        setError(
          err.message ||
            "Erro ao conectar com o servidor. Verifique se o backend está rodando.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const handleSelectHistory = (historyResult: AnalysisResult) => {
    setResult(historyResult);
    setError("");
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Card */}
        <Card className="ga-card border-0 bg-linear-to-r from-[#0d1f2d] to-[#0d1321] overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-cyan-500/5" />
          <CardBody className="p-6 sm:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <span className="text-3xl">🛰️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Dashboard de Análise Ambiental
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                  Análise ambiental com dados espaciais da NASA para prevenção
                  de riscos climáticos. Monitore temperatura, umidade,
                  precipitação, vento, radiação solar e focos de calor em
                  qualquer região do planeta.
                </p>
              </div>
              <Chip
                variant="flat"
                className="shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 ml-auto hidden sm:flex"
              >
                🌍 Dados em tempo real
              </Chip>
            </div>
          </CardBody>
        </Card>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda: Formulário + Histórico */}
          <div className="lg:col-span-1 space-y-6">
            <AnalysisForm onSubmit={handleAnalysis} isLoading={isLoading} />
            <HistoryPanel
              onSelectAnalysis={handleSelectHistory}
              refreshTrigger={refreshHistory}
            />
          </div>

          {/* Coluna direita: Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loading */}
            {isLoading && (
              <Card className="ga-card border-0">
                <CardBody className="py-16 flex flex-col items-center gap-4">
                  <Spinner size="lg" color="primary" />
                  <div className="text-center">
                    <p className="text-white font-medium">
                      Analisando dados da NASA...
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Consultando satélites e processando dados climáticos
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Error */}
            {error && (
              <Card className="ga-card border border-red-500/20">
                <CardBody className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="text-red-400 font-medium">
                        Erro na análise
                      </p>
                      <p className="text-sm text-slate-400 mt-1">{error}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Resultados */}
            {result && !isLoading && (
              <>
                {/* Localização */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📍</span>
                  <span>
                    {result.location.latitude.toFixed(4)},{" "}
                    {result.location.longitude.toFixed(4)}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span>
                    Período: {result.period.start} → {result.period.end}
                  </span>
                </div>

                {/* Climate Cards */}
                <ClimateCards
                  climate={result.climate}
                  fireCount={result.fires.length}
                />

                {/* Risk Gauge + Climate Chart */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <RiskGauge risk={result.risk} />
                  <ClimateChart climate={result.climate} />
                </div>

                {/* Fire Table */}
                <FireTable
                  fires={result.fires}
                  firmsMessage={result.firmsMessage}
                />
              </>
            )}

            {/* Estado vazio */}
            {!result && !isLoading && !error && (
              <Card className="ga-card border-0">
                <CardBody className="py-20 text-center">
                  <span className="text-6xl block mb-4 animate-float">🌍</span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Pronto para análise
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Insira as coordenadas de uma região ou use uma das sugestões
                    rápidas para começar a análise ambiental com dados da NASA.
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-slate-600 border-t border-white/5">
          <p>
            GuardaAgro © {new Date().getFullYear()} · FIAP Global Solution —
            Space Connect
          </p>
          <p className="mt-1">
            Dados climáticos: NASA POWER API · Focos de calor: NASA FIRMS API
          </p>
        </div>
      </main>
    </div>
  );
}
