"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Plus,
} from "lucide-react";

interface Atividade {
  id: string;
  contratoId: string;
  tipo:
    | "contrato_criado"
    | "contrato_renovado"
    | "status_alterado"
    | "pagamento_confirmado"
    | "auditoria";
  titulo: string;
  descricao: string;
  referencia: string;
  realizado_por: string;
  data: string;
  detalhes?: {
    acao?: string;
    link?: string;
    label?: string;
  };
}

interface MobileHistoricoProps {
  atividades?: Atividade[];
}

export function MobileHistorico({ atividades }: MobileHistoricoProps) {
  const atividedesDemo: Atividade[] = [];

  const atividadesParaMostrar = atividades || atividedesDemo;

  // Agrupar por data
  const agruparPorData = (ativs: Atividade[]) => {
    const grupos: Record<string, Atividade[]> = {};

    ativs.forEach((atv) => {
      const dataRelativa = new Date(atv.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!grupos[dataRelativa]) {
        grupos[dataRelativa] = [];
      }
      grupos[dataRelativa].push(atv);
    });

    return grupos;
  };

  const formatarHora = (data: string) => {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const atividadesPorData = agruparPorData(atividadesParaMostrar);

  const getIconeECor = (tipo: string) => {
    switch (tipo) {
      case "contrato_renovado":
        return {
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-l-4 border-l-orange-500",
          icone: (
            <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          ),
        };
      case "status_alterado":
        return {
          bgColor: "bg-blue-50 dark:bg-sky-900/20",
          borderColor: "border-l-4 border-l-[var(--sky-trust)]",
          icone: (
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ),
        };
      case "pagamento_confirmado":
        return {
          bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
          borderColor: "border-l-4 border-l-emerald-500",
          icone: (
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ),
        };
      case "contrato_criado":
        return {
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-l-4 border-l-orange-500",
          icone: (
            <Plus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          ),
        };
      case "auditoria":
        return {
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-l-4 border-l-red-500",
          icone: (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          ),
        };
      default:
        return {
          bgColor: "bg-slate-50 dark:bg-slate-900/20",
          borderColor: "border-l-4 border-l-slate-500",
          icone: (
            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          ),
        };
    }
  };

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Histórico de Atividades
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Acompanhe todas as alterações e ações realizadas no sistema.
        </p>
      </div>

      {/* Atividades agrupadas por data */}
      {Object.entries(atividadesPorData).map(([data, atividades]) => (
        <div key={data} className="mb-5">
          {/* Label da Data */}
          <div className="px-6 mb-5 ">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {data}
            </p>
          </div>

          {/* Atividades do dia */}
          <div className="px-4 space-y-3 flex flex-col gap-2">
            {atividades.map((atividade) => {
              const { bgColor, borderColor, icone } = getIconeECor(
                atividade.tipo,
              );
              return (
                <Card
                  key={atividade.id}
                  className={`border-0 !py-2 ${borderColor} ${bgColor}`}
                >
                  <CardContent className="p-3">
                    {/* Header com ícone e titulo */}
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        {icone}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate text-sm">
                            {atividade.titulo}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                            {formatarHora(atividade.data)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                          {atividade.referencia}
                        </p>
                      </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                      {atividade.descricao}
                    </p>

                    {/* Usuario */}
                    <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/50">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Por
                      </span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {atividade.realizado_por}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {atividadesParaMostrar.length === 0 && (
        <div className="px-4">
          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
            <CardContent className="py-12 text-center">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400">
                Nenhuma atividade registrada
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
