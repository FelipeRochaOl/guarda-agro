/**
 * AnalysisForm — Formulário de análise ambiental
 * Permite inserir coordenadas, selecionar período e usar sugestões rápidas
 */

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Chip,
  Divider,
} from "@heroui/react";

interface AnalysisFormProps {
  onSubmit: (latitude: number, longitude: number, days: number) => void;
  isLoading: boolean;
}

/** Coordenadas sugeridas */
const SUGGESTIONS = [
  { label: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { label: "Florianópolis", lat: -27.5954, lng: -48.548 },
  { label: "Poços de Caldas", lat: -21.7875, lng: -46.5614 },
  { label: "Amazônia", lat: -3.4653, lng: -62.2159 },
];

const PERIODS = [
  { key: "1", label: "1 dia" },
  { key: "3", label: "3 dias" },
  { key: "7", label: "7 dias" },
];

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [days, setDays] = useState("7");
  const [errors, setErrors] = useState<{ lat?: string; lng?: string }>({});

  const validate = (): boolean => {
    const newErrors: { lat?: string; lng?: string } = {};
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.lat = "Latitude deve estar entre -90 e 90";
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.lng = "Longitude deve estar entre -180 e 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(parseFloat(latitude), parseFloat(longitude), parseInt(days));
  };

  const applySuggestion = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setErrors({});
  };

  return (
    <Card className="ga-card border-0">
      <CardHeader className="flex flex-col items-start gap-2 pb-2 pt-5 px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛰️</span>
          <h2 className="ga-section-title text-white">Analisar Região</h2>
        </div>
        <p className="text-sm text-slate-400">
          Informe as coordenadas da região para análise ambiental com dados espaciais da NASA.
        </p>
      </CardHeader>

      <Divider className="bg-white/5" />

      <CardBody className="gap-5 px-6 py-5">
        {/* Sugestões rápidas */}
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2.5 uppercase tracking-wider">
            Sugestões rápidas
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Chip
                key={s.label}
                variant="flat"
                className="cursor-pointer transition-all hover:scale-105 bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300"
                onClick={() => applySuggestion(s.lat, s.lng)}
              >
                📍 {s.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Campos de coordenadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            placeholder="-23.5505"
            value={latitude}
            onValueChange={setLatitude}
            type="number"
            step="any"
            isInvalid={!!errors.lat}
            errorMessage={errors.lat}
            variant="bordered"
            classNames={{
              inputWrapper: "bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/40 group-data-[focus=true]:border-cyan-500",
              label: "text-slate-400",
              input: "text-white",
            }}
            startContent={<span className="text-slate-500 text-sm">φ</span>}
          />
          <Input
            label="Longitude"
            placeholder="-46.6333"
            value={longitude}
            onValueChange={setLongitude}
            type="number"
            step="any"
            isInvalid={!!errors.lng}
            errorMessage={errors.lng}
            variant="bordered"
            classNames={{
              inputWrapper: "bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/40 group-data-[focus=true]:border-cyan-500",
              label: "text-slate-400",
              input: "text-white",
            }}
            startContent={<span className="text-slate-500 text-sm">λ</span>}
          />
        </div>

        {/* Período */}
        <Select
          label="Período de análise"
          selectedKeys={[days]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (selected) setDays(String(selected));
          }}
          variant="bordered"
          classNames={{
            trigger: "bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/40 data-[focus=true]:border-cyan-500",
            label: "text-slate-400",
            value: "text-white",
          }}
        >
          {PERIODS.map((p) => (
            <SelectItem key={p.key}>{p.label}</SelectItem>
          ))}
        </Select>

        {/* Botão de análise */}
        <Button
          size="lg"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
        >
          {isLoading ? "Analisando região..." : "🔍 Analisar região"}
        </Button>
      </CardBody>
    </Card>
  );
}
