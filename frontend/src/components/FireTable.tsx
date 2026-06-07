/**
 * FireTable — Tabela de focos de calor detectados pela NASA FIRMS
 */

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import type { FireData } from "../types/analysis";

interface FireTableProps {
  fires: FireData[];
  firmsMessage?: string;
}

function getConfidenceColor(confidence: string): "success" | "warning" | "danger" | "default" {
  const c = confidence.toLowerCase();
  if (c === "high" || c === "h") return "danger";
  if (c === "nominal" || c === "n" || c === "medium") return "warning";
  if (c === "low" || c === "l") return "success";
  return "default";
}

export default function FireTable({ fires, firmsMessage }: FireTableProps) {
  return (
    <Card className="ga-card border-0 animate-fade-in-up" style={{ opacity: 0 }}>
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h2 className="ga-section-title text-white">Focos de Calor</h2>
          </div>
          <Chip
            size="sm"
            variant="flat"
            color={fires.length > 0 ? "danger" : "success"}
          >
            {fires.length} {fires.length === 1 ? "foco" : "focos"}
          </Chip>
        </div>
      </CardHeader>
      <Divider className="bg-white/5 mt-3" />
      <CardBody className="px-4 pb-4">
        {firmsMessage && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            ⚠️ {firmsMessage}
          </div>
        )}

        {fires.length === 0 && !firmsMessage ? (
          <div className="text-center py-8 text-slate-400">
            <span className="text-4xl block mb-3">✅</span>
            <p className="font-medium">Nenhum foco de calor detectado</p>
            <p className="text-sm mt-1">A região está livre de incêndios ativos.</p>
          </div>
        ) : fires.length > 0 ? (
          <Table
            aria-label="Focos de calor detectados"
            classNames={{
              wrapper: "bg-transparent shadow-none p-0",
              th: "bg-slate-800/50 text-slate-400 font-semibold text-xs uppercase",
              td: "text-slate-300 text-sm",
            }}
            removeWrapper
          >
            <TableHeader>
              <TableColumn>Latitude</TableColumn>
              <TableColumn>Longitude</TableColumn>
              <TableColumn>Brilho</TableColumn>
              <TableColumn>Confiança</TableColumn>
              <TableColumn>Data</TableColumn>
              <TableColumn>Satélite</TableColumn>
            </TableHeader>
            <TableBody>
              {fires.slice(0, 20).map((fire, index) => (
                <TableRow key={index}>
                  <TableCell>{fire.latitude.toFixed(4)}</TableCell>
                  <TableCell>{fire.longitude.toFixed(4)}</TableCell>
                  <TableCell>{fire.brightness.toFixed(1)} K</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getConfidenceColor(fire.confidence)}
                    >
                      {fire.confidence}
                    </Chip>
                  </TableCell>
                  <TableCell>{fire.acqDate} {fire.acqTime}</TableCell>
                  <TableCell>{fire.satellite}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}

        {fires.length > 20 && (
          <p className="text-xs text-slate-500 mt-3 text-center">
            Mostrando 20 de {fires.length} focos detectados.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
