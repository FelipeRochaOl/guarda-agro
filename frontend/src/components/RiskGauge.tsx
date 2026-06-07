/**
 * RiskGauge — Indicador visual do índice de risco ambiental
 * Usa Highcharts solidgauge para exibir o score e fatores/recomendações
 */

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";
import type { RiskAssessment, RiskLevel } from "../types/analysis";

interface RiskGaugeProps {
  risk: RiskAssessment;
}

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "Baixo":
      return "#10b981";
    case "Médio":
      return "#f59e0b";
    case "Alto":
      return "#f97316";
    case "Crítico":
      return "#ef4444";
  }
}

function getRiskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case "Baixo":
      return "risk-baixo";
    case "Médio":
      return "risk-medio";
    case "Alto":
      return "risk-alto";
    case "Crítico":
      return "risk-critico";
  }
}

export default function RiskGauge({ risk }: RiskGaugeProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const color = getRiskColor(risk.level);

  const gaugeOptions: Highcharts.Options = {
    chart: {
      type: "solidgauge",
      backgroundColor: "transparent",
      height: 220,
      margin: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    pane: {
      center: ["50%", "70%"],
      size: "120%",
      startAngle: -110,
      endAngle: 110,
      background: [
        {
          backgroundColor: "#1e293b",
          innerRadius: "75%",
          outerRadius: "100%",
          shape: "arc",
          borderWidth: 0,
        },
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.34, "#10b981"],
        [0.59, "#f59e0b"],
        [0.79, "#f97316"],
        [1, "#ef4444"],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickWidth: 0,
      tickAmount: 0,
      labels: { enabled: false },
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: -25,
          borderWidth: 0,
          useHTML: true,
          format: `<div style="text-align:center"><span style="font-size:2.5rem;font-weight:800;color:${color}">{y}</span><br/><span style="font-size:0.75rem;color:#94a3b8">de 100</span></div>`,
        },
        rounded: true,
      },
    },
    tooltip: { enabled: false },
    series: [
      {
        name: "Risco",
        type: "solidgauge",
        data: [risk.score],
        innerRadius: "75%",
      },
    ],
  };

  return (
    <Card
      className="ga-card border-0 animate-fade-in-up"
      style={{ opacity: 0 }}
    >
      <CardHeader className="flex flex-col items-start gap-2 pb-0 pt-5 px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h2 className="ga-section-title text-white">
              Índice de Risco Ambiental
            </h2>
          </div>
          <Chip
            size="lg"
            className={`${getRiskBadgeClass(risk.level)} font-bold text-sm px-4`}
          >
            {risk.level}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="px-6 pb-6">
        {/* Gauge */}
        <div className="flex justify-center">
          <HighchartsReact
            highcharts={Highcharts}
            options={gaugeOptions}
            ref={chartRef}
          />
        </div>

        <Divider className="bg-white/5 my-4" />

        {/* Fatores de risco */}
        {risk.factors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Fatores de risco identificados
            </p>
            <ul className="space-y-2">
              {risk.factors.map((factor, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="text-amber-400 mt-0.5">▸</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendações */}
        {risk.recommendations.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Recomendações
            </p>
            <ul className="space-y-2">
              {risk.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
