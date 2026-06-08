/**
 * ClimateChart — Gráfico de dados climáticos com Highcharts
 * Exibe temperatura, umidade, precipitação, vento e radiação em barras agrupadas
 */

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";
import "highcharts/modules/solid-gauge";
import type { ClimateData } from "../types/analysis";

interface ClimateChartProps {
  climate: ClimateData;
}

export default function ClimateChart({ climate }: ClimateChartProps) {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      height: 320,
      style: { fontFamily: "Inter, sans-serif" },
    },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      categories: [
        "Temp. Média",
        "Temp. Máx.",
        "Temp. Mín.",
        "Umidade",
        "Precipitação",
        "Vento (km/h)",
        "Radiação Solar",
      ],
      labels: {
        style: { color: "#94a3b8", fontSize: "10px" },
        rotation: -30,
      },
      lineColor: "#1e293b",
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: "#1e293b",
      labels: { style: { color: "#64748b" } },
    },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: "#1a2332",
      borderColor: "#334155",
      style: { color: "#f1f5f9" },
      headerFormat:
        '<span style="font-size:12px;font-weight:600">{point.key}</span><br/>',
      pointFormat: '<span style="color:{point.color}">●</span> {point.y:.2f}',
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        borderWidth: 0,
        colorByPoint: true,
      },
    },
    colors: [
      "#f97316", // Temp média
      "#ef4444", // Temp máx
      "#3b82f6", // Temp mín
      "#06b6d4", // Umidade
      "#8b5cf6", // Precipitação
      "#14b8a6", // Vento
      "#eab308", // Radiação
    ],
    series: [
      {
        name: "Valor",
        type: "column",
        data: [
          climate.temperature,
          climate.temperatureMax,
          climate.temperatureMin,
          climate.humidity,
          climate.precipitation,
          +(climate.windSpeed * 3.6).toFixed(1),
          climate.solarRadiation,
        ],
      },
    ],
  };

  return (
    <Card
      className="ga-card border-0 animate-fade-in-up"
      style={{ opacity: 0 }}
    >
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <h2 className="ga-section-title text-white">Dados Climáticos</h2>
        </div>
      </CardHeader>
      <Divider className="bg-white/5 mt-3" />
      <CardBody className="px-4 pb-4">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </CardBody>
    </Card>
  );
}
