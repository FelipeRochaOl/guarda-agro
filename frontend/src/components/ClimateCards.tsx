/**
 * ClimateCards — Cards de dados climáticos
 * Exibe os principais indicadores climáticos com ícones e cores
 */

import { Card, CardBody } from "@heroui/react";
import type { ClimateData } from "../types/analysis";

interface ClimateCardsProps {
  climate: ClimateData;
  fireCount: number;
}

interface MetricCard {
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  bgColor: string;
}

export default function ClimateCards({ climate, fireCount }: ClimateCardsProps) {
  const metrics: MetricCard[] = [
    {
      label: "Temperatura Média",
      value: climate.temperature.toFixed(1),
      unit: "°C",
      icon: "🌡️",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Umidade Relativa",
      value: climate.humidity.toFixed(1),
      unit: "%",
      icon: "💧",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Precipitação",
      value: climate.precipitation.toFixed(2),
      unit: "mm/dia",
      icon: "🌧️",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Velocidade do Vento",
      value: (climate.windSpeed * 3.6).toFixed(1),
      unit: "km/h",
      icon: "💨",
      color: "text-teal-400",
      bgColor: "bg-teal-500/10 border-teal-500/20",
    },
    {
      label: "Radiação Solar",
      value: climate.solarRadiation.toFixed(2),
      unit: "kWh/m²",
      icon: "☀️",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      label: "Focos de Calor",
      value: fireCount.toString(),
      unit: fireCount === 1 ? "foco" : "focos",
      icon: "🔥",
      color: fireCount > 0 ? "text-red-400" : "text-emerald-400",
      bgColor: fireCount > 0
        ? "bg-red-500/10 border-red-500/20"
        : "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((metric, index) => (
        <Card
          key={metric.label}
          className={`ga-card border ${metric.bgColor} animate-fade-in-up stagger-${index + 1}`}
          style={{ opacity: 0 }}
        >
          <CardBody className="p-4 text-center">
            <span className="text-2xl mb-2 block">{metric.icon}</span>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
            <p className={`text-xs ${metric.color} opacity-80`}>
              {metric.unit}
            </p>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
              {metric.label}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
