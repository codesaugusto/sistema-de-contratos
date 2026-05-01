"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

interface Contrato {
  id: string;
  titulo: string;
  empresa: string;
  motorista: string;
  valor: number;
  dataVencimento: string;
  status: string;
}

interface ReportStats {
  totalContratos: number;
  contratosAtivos: number;
  contratosVencidos: number;
  contratoPendentes: number;
  valorTotalAtivos: number;
  valorTotalVencidos: number;
}

interface RevenueByCompany {
  name: string;
  valor: number;
}

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface MobileRelatoriosProps {
  contratos?: Contrato[];
  onDelete?: (id: string) => void;
  stats?: ReportStats;
  revenueByCompany?: RevenueByCompany[];
  distribution?: DistributionItem[];
  refetch?: () => void;
  onExportarExcel?: () => void;
  statusFiltro?: string | null;
  onStatusChange?: (status: string | null) => void;
}

export function MobileRelatorios({
  contratos: contratosProp,
  onDelete,
  stats: propStats,
  revenueByCompany,
  distribution,
  refetch,
  onExportarExcel,
  statusFiltro: statusFiltroProp,
  onStatusChange,
}: MobileRelatoriosProps) {
  const [filtro, setFiltro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 5;

  // Usar filtro da prop ou estado local
  const statusFiltroAtual = statusFiltroProp || "";
  const statusFiltrNormalizado =
    statusFiltroAtual === "" ? "" : statusFiltroAtual.toLowerCase();

  // Usar contratos da prop, ou array vazio se undefined
  const contratos = contratosProp || [];

  const contratosFiltrados = contratos.filter((c) => {
    if (!c) return false;
    const matchText =
      (c.titulo ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
      (c.empresa ?? "").toLowerCase().includes(filtro.toLowerCase());

    const matchStatus =
      statusFiltrNormalizado === "" ||
      statusFiltrNormalizado === null ||
      c.status.toLowerCase() === statusFiltrNormalizado;

    return matchText && matchStatus;
  });

  // Paginação
  const totalPaginas = Math.ceil(contratosFiltrados.length / ITENS_POR_PAGINA);
  const indiceFinal = paginaAtual * ITENS_POR_PAGINA;
  const indiceInicial = indiceFinal - ITENS_POR_PAGINA;
  const contratosPage = contratosFiltrados.slice(indiceInicial, indiceFinal);

  // Reset página ao filtrar
  const handleFiltroChange = (novoFiltro: string) => {
    setFiltro(novoFiltro);
    setPaginaAtual(1);
  };

  const handleStatusChange = (novoStatus: string | null) => {
    onStatusChange?.(novoStatus);
    setPaginaAtual(1);
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
      case "vencido":
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
      case "pendente":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
      case "cancelado":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "ativo":
        return "border-l-4 border-l-emerald-500";
      case "vencido":
        return "border-l-4 border-l-red-500";
      case "pendente":
        return "border-l-4 border-l-yellow-500";
      default:
        return "border-l-4 border-l-slate-400";
    }
  };

  // Cálculos
  const valorTotal = contratosFiltrados.reduce((sum, c) => sum + c.valor, 0);
  const contratosAtivos = contratosFiltrados.filter(
    (c) => c.status === "ativo",
  ).length;
  const contratosVencendoEsMes = contratosFiltrados.filter((c) => {
    if (c.status !== "ativo") return false;
    const dataVencimento = new Date(c.dataVencimento);
    const hoje = new Date();
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    return dataVencimento < proximoMes && dataVencimento > hoje;
  }).length;

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl pl-1 font-bold text-slate-900 dark:text-white">
            Relatórios
          </h1>
        </div>
        <div className="flex gap-2">
          {refetch && (
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {onExportarExcel && (
            <Button
              onClick={onExportarExcel}
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {/* ========== VALOR EM VIGOR CARD ========== */}
      <div className="px-4 mb-4">
        <Card className="border-0 border-l-4 border-l-[var(--sky-trust)] bg-sky-300-50 dark:bg-slate-900/50 shadow-lg overflow-hidden">
          <CardContent className="p-4 text-black dark:text-white">
            <p className="text-xs font-semibold opacity-70 mb-2 tracking-wide uppercase">
              Valor em Vigor
            </p>
            <h3 className="text-4xl font-bold text-black dark:text-white mb-4">
              {formatarValor(valorTotal)}
            </h3>
            <div className="flex gap-3 pt-2 border-t border-slate-300 dark:border-white/10">
              <div className="flex-1">
                <p className="text-xs opacity-70 mb-1">Contratos</p>
                <p className="text-xl font-bold">{contratosFiltrados.length}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs opacity-70 mb-1">Ticket Médio</p>
                <p className="text-xl font-bold">
                  {contratosFiltrados.length > 0
                    ? formatarValor(valorTotal / contratosFiltrados.length)
                    : "R$ 0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== MÉTRICAS RÁPIDAS ========== */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-4">
        {/* Total Ativos */}
        <Card className="border-0 border-l-4 border-l-emerald-500 bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Total Ativos
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {String(contratosAtivos).padStart(2, "0")}
            </p>
          </CardContent>
        </Card>

        {/* Vencendo Este Mês */}
        <Card className="border-0 border-l-4 border-l-[var(--sky-trust)] bg-slate-50 dark:bg-slate-900/50 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              Vencendo Este Mês
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {String(contratosVencendoEsMes).padStart(2, "0")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ========== FILTROS ========== */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["", "ativo", "pendente", "vencido", "expirando"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status === "" ? null : status)}
              className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                statusFiltrNormalizado === status
                  ? "bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white dark:bg-[var(--sky-trust)] dark:hover:bg-[var(--sky-trust)]/90"
                  : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
              }`}
            >
              {status === ""
                ? "Todos"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ========== SEARCH ========== */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por título ou empresa..."
            value={filtro}
            onChange={(e) => handleFiltroChange(e.target.value)}
            className="pl-10 bg-slate-100 dark:bg-slate-800 border-0"
          />
        </div>
      </div>

      {/* ========== GRÁFICO DE ROSCA ========== */}
      {contratosFiltrados.length > 0 && (
        <div className="px-4 mb-4">
          <Card className="border-0 border-l-4 border-l-[var(--sky-trust)] bg-slate-50 dark:bg-slate-900/50 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
                Distribuição por Status
              </p>
              <PieChart width={280} height={220}>
                <Pie
                  data={[
                    {
                      name: "Ativos",
                      value: contratosFiltrados.filter(
                        (c) => c.status === "ativo",
                      ).length,
                    },
                    {
                      name: "Vencidos",
                      value: contratosFiltrados.filter(
                        (c) => c.status === "vencido",
                      ).length,
                    },
                    {
                      name: "Pendentes",
                      value: contratosFiltrados.filter(
                        (c) => c.status === "pendente",
                      ).length,
                    },
                  ]}
                  cx={110}
                  cy={80}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                />
              </PieChart>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========== LISTA DE CONTRATOS ========== */}
      <div className="px-4 space-y-3 flex flex-col gap-2 pb-32">
        {contratosFiltrados.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                Nenhum contrato encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {contratosPage.map((contrato) => (
              <Link key={contrato.id} href={`/contratos/${contrato.id}`}>
                <Card
                  className={`border-0 ${getStatusBorder(contrato.status)} bg-slate-50 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-all cursor-pointer`}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                          {contrato.titulo}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          Empresa: {contrato.empresa}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs flex-shrink-0 ml-2 capitalize ${getStatusColor(contrato.status)}`}
                      >
                        {contrato.status}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide mb-1">
                          Expiração
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatarData(contrato.dataVencimento)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide mb-1">
                          Valor Total
                        </p>
                        <p className="font-bold text-black dark:text-white text-lg">
                          {formatarValor(contrato.valor)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* ========== CONTROLES DE PAGINAÇÃO ========== */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 px-2">
                <button
                  onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                  disabled={paginaAtual === 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="text-slate-600 dark:text-slate-400">
                    &lsaquo;
                  </span>
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setPaginaAtual(page)}
                      className={`w-8 h-8 rounded text-sm font-medium cursor-pointer transition-colors ${
                        paginaAtual === page
                          ? "bg-[#0890bb] hover:bg-[#06639a] text-white dark:bg-[#06b6d4] dark:hover:bg-[#0398c4]"
                          : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))
                  }
                  disabled={paginaAtual === totalPaginas}
                  className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="text-slate-600 dark:text-slate-400">
                    &rsaquo;
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========== FAB NOVO CONTRATO ========== */}
      <Link href="/contratos/novo" className="fixed bottom-24 right-4 z-40">
        <Button className="rounded-full w-14 h-14 bg-[var(--sky-trust)] hover:bg-[var(--sky-trust-hover)] text-white shadow-lg flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
