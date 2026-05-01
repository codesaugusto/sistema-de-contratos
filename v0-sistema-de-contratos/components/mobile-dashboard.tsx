"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Bell,
  Plus,
  RotateCw,
  Building2,
  MoreHorizontal,
  TrendingDown,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { ContractCard } from "./contract-card";

interface MobileDashboardProps {
  stats: {
    renovacao: number;
    totalContratos: number;
    contratosAtivos: number;
    proximosVencimentos: number;
    pendentes: number;
    valorTotal: number;
    totalClientes?: number;
    taxaRenovacao?: number;
    vencidos?: number;
    contratosFinalizados?: number;
    valorMedio?: number;
  };
  contratos: any[];
  estatisticasEmpresas?: Array<{ name: string; valor: number }>;
  crescimentoVendas?: number;
}

export function MobileDashboard({
  stats,
  contratos,
  estatisticasEmpresas = [],
  crescimentoVendas = 12.5,
}: MobileDashboardProps) {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatarValorK = (valor: number) => {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(1)}M`;
    }
    if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(0)}k`;
    }
    return formatarValor(valor);
  };

  // Preparar dados para o gráfico de pizza
  const statusData = [
    {
      name: "Finalizados",
      value: stats.contratosFinalizados || 0,
      color: "#f97316", // orange-500
    },
    {
      name: "Em Aberto",
      value: stats.contratosAtivos || 0,
      color: "#10b981", // emerald-500
    },
    {
      name: "Atrasados",
      value: stats.vencidos || stats.pendentes || 0,
      color: "#ef4444", // red-500
    },
  ];

  // Dados de amostra para demonstração

  // Usa contratos reais se houver, senão usa dados de amostra
  const contratosParaMostrar =
    contratos && contratos.length > 0 ? contratos : []; //[]; // Substitua por dados de amostra se necessário

  // Agrupar receitas por empresa e calcular top 3
  const empresasAgrupadas: Record<string, number> = {};
  contratosParaMostrar.forEach((c) => {
    if (c.status === "ativo") {
      empresasAgrupadas[c.empresa] =
        (empresasAgrupadas[c.empresa] || 0) + (c.valor || 0);
    }
  });

  const topEmpresas = Object.entries(empresasAgrupadas)
    .map(([name, valor]) => ({ name, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 3);
  return (
    <div className="pb-12 pt-4">
      {/* Header */}
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl pl-1 font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
        </div>
      </div>
      {/* ========== REVENUE TOTAL CARD ========== */}
      <div className="mx-4 mb-6 border-0 border-l-4 border-l-[var(--sky-trust)] bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 text-black dark:text-white shadow-sm">
        <p className="text-sm opacity-70 mb-2 font-medium">RECEITA TOTAL</p>
        <h2 className="text-4xl font-bold mb-3">
          {formatarValor(stats.valorTotal)}
        </h2>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400">
            +{crescimentoVendas.toFixed(1)}% este mês
          </span>
        </div>
        <Link href="/contratos/novo">
          <Button className="w-full bg-blue-700/70 hover:bg-blue-600/70 dark:bg-white/15 dark:hover:bg-white/25 text-white border border-white/20 rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
          </Button>
        </Link>
      </div>

      {/* ========== MAIN METRICS GRID ========== */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        {/* Total Contratos */}
        <Card className="border-0 border-l-4 border-l-[var(--sky-trust)] bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Contratos
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.totalContratos}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contratos Ativos */}
        <Card className="border-0 border-l-4 border-l-emerald-500 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Ativos
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.contratosAtivos}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vencimentos */}
        <Card className="border-0 border-l-4 border-l-red-500 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Vencimentos
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.vencidos}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Médio */}
        <Card className="border-0 border-l-4 border-l-[var(--sky-trust)] bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Ticket Médio
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {formatarValorK(stats.valorMedio || 0)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card className="border-0 border-l-4 border-l-purple-500 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Clientes
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.totalClientes || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Renovação */}
        <Card className="border-0 border-l-4 border-l-emerald-500 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Taxa de Renovação
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.taxaRenovacao || 0}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== ANÁLISE DE RECEITA COM GRÁFICO DE PIZZA ========== */}
      <div className="px-4 mb-6">
        <Card className="border-0 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">
                Análise de Receita
              </CardTitle>
              <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
                <MoreHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Contêiner do Gráfico de Pizza */}
            <div className="flex items-center justify-center py-4">
              {statusData.some((d) => d.value > 0) ? (
                <div className="w-full flex justify-center">
                  <PieChart width={300} height={250}>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              ) : (
                <div className="w-full h-60 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                  Sem dados para exibir
                </div>
              )}
            </div>

            {/* Legenda */}
            <div className="space-y-2 mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              {statusData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.value > 0
                      ? Math.round(
                          (item.value /
                            statusData.reduce((acc, d) => acc + d.value, 0)) *
                            100,
                        ) + "%"
                      : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== RESUMO DE RECEITA POR EMPRESA ========== */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Resumo de Receita por Empresa
          </h3>
        </div>

        <div className="space-y-3">
          {topEmpresas.length > 0 ? (
            topEmpresas.map((empresa, index) => {
              const getAvatarColor = (idx: number) => {
                const colors = [
                  "bg-orange-100 dark:bg-orange-900/40",
                  "bg-blue-100 dark:bg-blue-900/40",
                  "bg-slate-200 dark:bg-slate-800",
                ];
                return colors[idx % colors.length];
              };

              const getIconColor = (idx: number) => {
                const colors = [
                  "text-orange-600 dark:text-orange-400",
                  "text-blue-600 dark:text-blue-400",
                  "text-slate-600 dark:text-slate-400",
                ];
                return colors[idx % colors.length];
              };

              return (
                <Card
                  key={empresa.name}
                  className="border-0 border-l-4 border-l-[var(--sky-trust)] bg-slate-50 dark:bg-slate-900/50 shadow-sm overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg ${getAvatarColor(index)} flex items-center justify-center flex-shrink-0`}
                      >
                        <Building2
                          className={`w-6 h-6 ${getIconColor(index)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {empresa.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {
                            contratosParaMostrar.filter(
                              (c) =>
                                c.empresa === empresa.name &&
                                c.status === "ativo",
                            ).length
                          }{" "}
                          CONTRATOS ATIVOS
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-black dark:text-white">
                          {formatarValorK(empresa.valor)}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                          +{Math.round(Math.random() * 5)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nenhuma empresa com contratos ativos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ========== CONTRATOS RECENTES ========== */}
      <div className="px-4 pb-16">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Contratos Recentes
        </h3>

        {contratosParaMostrar.length > 0 ? (
          <div className="space-y-4 flex flex-col gap-2">
            {contratosParaMostrar.slice(0, 5).map((contrato) => (
              <ContractCard key={contrato.id} contract={contrato} />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhum contrato encontrado
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
