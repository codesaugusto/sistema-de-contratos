"use client";

import { useEffect, useMemo } from "react";
import { Check, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractTimelineProps {
  status: "criado" | "ativo" | "expirando" | "vencido";
  dataCriacao: string; // ISO date
  dataAtivacao?: string; // ISO date
  dataVencimento: string; // ISO date
  className?: string;
  compact?: boolean; // Se true, mostra versão miniaturizada
  createdContractsCount: number; // Quantidade de contratos criados
  activeContractsCount: number; // Quantidade de contratos ativos
  expiringContractsCount: number; // Quantidade de contratos expirando
  expiredContractsCount: number; // Quantidade de contratos vencidos
}

const timelineStages = [
  {
    id: "criado",
    label: "Criado",
    icon: Check,
    color: "text-slate-500",
    bg: "bg-slate-200 dark:bg-slate-700",
  },
  {
    id: "ativo",
    label: "Ativo",
    icon: Clock,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-200 dark:bg-emerald-900/60",
    semanticColor: "var(--success-active)",
  },
  {
    id: "expirando",
    label: "Expirando",
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-200 dark:bg-amber-900/60",
    semanticColor: "var(--safety-yellow)",
  },
  {
    id: "vencido",
    label: "Vencido",
    icon: ChevronRight,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-200 dark:bg-red-900/60",
    semanticColor: "var(--error-vencido)",
  },
];

export function ContractTimeline({
  status,
  dataCriacao,
  dataAtivacao,
  dataVencimento,
  className,
  compact = false,
  createdContractsCount,
  activeContractsCount,
  expiringContractsCount,
  expiredContractsCount,
}: ContractTimelineProps) {
  const diasAteVencimento = useMemo(() => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const dias = Math.ceil(
      (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return dias;
  }, [dataVencimento]);

  const orderStages = [0, 1, 2, 3]; // Índices das fases
  const currentStageIndex = timelineStages.findIndex((s) => s.id === status);

  if (compact) {
    return (
      <div
        className={cn("flex items-center gap-1 text-xs font-medium", className)}
      >
        {timelineStages.map((stage, idx) => {
          const isActive = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex items-center gap-1">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                  isActive ? stage.bg : "bg-slate-200 dark:bg-slate-700",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive
                      ? stage.color
                      : "text-slate-500 dark:text-slate-400",
                  )}
                />
              </div>
              {idx < timelineStages.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 rounded-full",
                    isActive ? stage.bg : "bg-slate-200 dark:bg-slate-700",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-lg border border-[var(--border-default)] bg-white p-7 dark:bg-slate-950 min-h-[280px]",
        className,
      )}
    >
      {/* Timeline visual */}
      <div className="flex items-center justify-between gap-2">
        {timelineStages.map((stage, idx) => {
          const isActive = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex flex-1 items-center gap-2">
              {/* Stage circle */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                  isActive ? stage.bg : "bg-slate-200 dark:bg-slate-700",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive
                      ? stage.color
                      : "text-slate-500 dark:text-slate-400",
                  )}
                />
              </div>

              {/* Connector line */}
              {idx < timelineStages.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 transition-colors rounded-full",
                    isActive
                      ? "bg-slate-400 dark:bg-slate-500"
                      : "bg-slate-200 dark:bg-slate-700",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels and dates */}
      <div className="grid grid-cols-4 gap-2">
        {timelineStages.map((stage, idx) => (
          <div
            key={stage.id}
            className="flex flex-col items-center gap-1 text-center"
          >
            <p
              className={cn(
                "text-xs font-semibold transition-colors",
                idx <= currentStageIndex
                  ? "text-slate-900 dark:text-slate-50"
                  : "text-slate-500 dark:text-slate-400",
              )}
            >
              {stage.label}
            </p>

            {/* Date/duration info */}
            <p
              className={cn(
                "text-xs font-medium transition-colors",
                idx <= currentStageIndex
                  ? "text-slate-600 dark:text-slate-400"
                  : "text-slate-500 dark:text-slate-500",
              )}
            >
              {stage.id === "criado" && (
                <span>
                  {createdContractsCount} contrato
                  {createdContractsCount > 1 ? "s" : ""} criado
                  {createdContractsCount > 1 ? "s" : ""}
                </span>
              )}
              {stage.id === "ativo" && (
                <span>
                  {activeContractsCount} contrato
                  {activeContractsCount > 1 ? "s" : ""} ativo
                  {activeContractsCount > 1 ? "s" : ""}
                </span>
              )}

              {stage.id === "expirando" && (
                <span>
                  {expiringContractsCount} contrato
                  {expiringContractsCount > 1 ? "s" : ""} expirando
                </span>
              )}
              {stage.id === "vencido" && (
                <span>
                  {expiredContractsCount} contrato
                  {expiredContractsCount > 1 ? "s" : ""} vencido
                  {expiredContractsCount > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Status message */}
      <div
        className={cn(
          "rounded-md border-l-4 px-3 py-2 text-xs font-medium",
          status === "ativo" &&
            "border-emerald-600 bg-emerald-100 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-100",
          status === "expirando" &&
            "border-amber-600 bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100",
          status === "vencido" &&
            "border-red-600 bg-red-100 dark:bg-red-900/80 text-red-900 dark:text-red-100",
          status === "criado" &&
            "border-slate-400 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
        )}
      >
        {status === "ativo" && (
          <span>
            ✓ {activeContractsCount} contrato
            {activeContractsCount > 1 ? "s" : ""} ativo
            {activeContractsCount > 1 ? "s" : ""}
          </span>
        )}
        {status === "expirando" && (
          <span>
            ⚠ Contrato expirando: {diasAteVencimento} dias até vencimento
          </span>
        )}
        {status === "vencido" && (
          <span>
            ✕ Contrato vencido desde{" "}
            {new Date(dataVencimento).toLocaleDateString("pt-BR")}
          </span>
        )}
        {status === "criado" && (
          <span>
            ○ Contrato criado em{" "}
            {new Date(dataCriacao).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>
    </div>
  );
}

export function ContractTimelineCompact({
  status,
  dataVencimento,
  createdContractsCount,
  activeContractsCount,
  expiringContractsCount,
  expiredContractsCount,
}: {
  status: string;
  dataVencimento: string;
  createdContractsCount: number;
  activeContractsCount: number;
  expiringContractsCount: number;
  expiredContractsCount: number;
}) {
  const diasAteVencimento = useMemo(() => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const dias = Math.ceil(
      (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return dias;
  }, [dataVencimento]);

  return (
    <ContractTimeline
      status={status as any}
      dataCriacao={new Date().toISOString()}
      dataVencimento={dataVencimento}
      createdContractsCount={createdContractsCount}
      activeContractsCount={activeContractsCount}
      expiringContractsCount={expiringContractsCount}
      expiredContractsCount={expiredContractsCount}
      compact
    />
  );
}
