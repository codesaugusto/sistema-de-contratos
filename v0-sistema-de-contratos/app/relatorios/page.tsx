"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Download,
  Filter,
  TrendingUp,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  FileJson,
  RefreshCw,
  Building,
  BarChart3,
} from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { MobileRelatorios } from "@/components/mobile-relatorios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  exportarParaExcel,
  exportarParaPDF,
  exportarParaJSON,
} from "@/lib/export-utils";
import { useRouter } from "next/navigation";
import { useRelatorioDashboard } from "@/hooks/use-relatorios";
import { Spinner } from "@/components/ui/spinner";

export default function Relatorios() {
  const isMobile = useIsMobile();
  const { theme, systemTheme } = useTheme();
  const router = useRouter();
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);

  // 🔹 PASSO 1: Chamar o hook para carregar dados da API
  const { stats: apiStats, loading, error, refetch } = useRelatorioDashboard();

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");
  const chartStroke = isDark ? "#94a3b8" : "#000000";
  const chartGridStroke = isDark ? "#334155" : "#e2e8f0";

  // 🔹 PASSO 2: Renderizar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="w-12 h-12 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  // 🔹 PASSO 3: Renderizar erro
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Erro ao carregar relatórios
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    {error}
                  </p>
                  <Button
                    onClick={refetch}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // 🔹 PASSO 4: Se não houver dados, renderizar vazio
  if (!apiStats) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-600 dark:text-slate-400">
                Nenhum dado disponível
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PASSO 5: Processar dados da API para compatibilidade com UI
  // ════════════════════════════════════════════════════════════════════════

  const contratos = apiStats?.proximosVencimentos || [];

  // Filtrar contratos por status se selecionado
  const contratosFiltrados = statusFiltro
    ? contratos.filter(
        (c) => c.status.toUpperCase() === statusFiltro.toUpperCase(),
      )
    : contratos;

  // 📊 Estrutura de estatísticas
  const stats = {
    total: apiStats?.totalContratos || 0,
    ativos: apiStats?.contratosAtivos || 0,
    vencidos: apiStats?.contratosVencidos || 0,
    pendentes: apiStats?.contratosExpirando || 0,
    cancelados: 0,
    valorTotal: apiStats?.valorTotal || 0,
    valorAtivos: apiStats?.valorTotal || 0,
  };

  // 📊 Dados para gráfico de status
  const contratosFiltradosParaGraficos = statusFiltro
    ? contratos.filter(
        (c) => c.status.toLowerCase() === statusFiltro.toLowerCase(),
      )
    : contratos;

  const statsFilteredStatus = {
    ativos: contratosFiltradosParaGraficos.filter(
      (c) => c.status.toUpperCase() === "ATIVO",
    ).length,
    vencidos: contratosFiltradosParaGraficos.filter(
      (c) => c.status.toUpperCase() === "VENCIDO",
    ).length,
    pendentes: contratosFiltradosParaGraficos.filter(
      (c) => c.status.toUpperCase() === "PENDENTE",
    ).length,
    expirando: contratosFiltradosParaGraficos.filter(
      (c) => c.status.toUpperCase() === "EXPIRANDO",
    ).length,
    valorAtivos: contratosFiltradosParaGraficos
      .filter((c) => c.status.toUpperCase() === "ATIVO")
      .reduce((acc, c) => acc + (c.valor || 0), 0),
    valorVencidos: contratosFiltradosParaGraficos
      .filter((c) => c.status.toUpperCase() === "VENCIDO")
      .reduce((acc, c) => acc + (c.valor || 0), 0),
    valorPendentes: contratosFiltradosParaGraficos
      .filter((c) => c.status.toUpperCase() === "PENDENTE")
      .reduce((acc, c) => acc + (c.valor || 0), 0),
    valorExpirando: contratosFiltradosParaGraficos
      .filter((c) => c.status.toUpperCase() === "EXPIRANDO")
      .reduce((acc, c) => acc + (c.valor || 0), 0),
  };

  const dataStatus = [
    { name: "Ativos", value: statsFilteredStatus.ativos, color: "#10b981" },
    {
      name: "Vencidos",
      value: statsFilteredStatus.vencidos,
      color: "#ef4444",
    },
    {
      name: "Pendentes",
      value: statsFilteredStatus.pendentes,
      color: "#8b5cf6",
    },
    {
      name: "Expirando",
      value: statsFilteredStatus.expirando,
      color: "#f59e0b",
    },
  ].filter((d) => d.value > 0);

  // 📊 Dados para gráfico por empresa
  const empresasFromApi = [
    ...new Set(contratosFiltradosParaGraficos.map((c) => c.empresa)),
  ];
  const dataEmpresa = empresasFromApi.map((empresa) => ({
    empresa: empresa.substring(0, 10),
    total: contratosFiltradosParaGraficos.filter((c) => c.empresa === empresa)
      .length,
    ativos: contratosFiltradosParaGraficos.filter(
      (c) => c.empresa === empresa && c.status.toUpperCase() === "ATIVO",
    ).length,
    vencidos: contratosFiltradosParaGraficos.filter(
      (c) => c.empresa === empresa && c.status.toUpperCase() === "VENCIDO",
    ).length,
  }));

  // 📊 Dados para gráfico de valor
  const dataValor = [
    { status: "Ativos", valor: statsFilteredStatus.valorAtivos },
    { status: "Vencidos", valor: statsFilteredStatus.valorVencidos },
    { status: "Pendentes", valor: statsFilteredStatus.valorPendentes },
    { status: "Expirando", valor: statsFilteredStatus.valorExpirando },
  ].filter((d) => d.valor > 0);

  // 📊 Próximos vencimentos com dias restantes calculados
  const proximosVencimentos = (apiStats?.proximosVencimentos || []).map((c) => {
    const dataVencimento = new Date(c.dataVencimento);
    const hoje = new Date();
    const diasRestantes = Math.ceil(
      (dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return { contrato: c, diasRestantes };
  });

  // 🛠️ Função auxiliar para formatar valores
  const formatarValor = (valor: number | undefined) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // 🔘 Handlers para exportação
  const handleExportarExcel = async () => {
    const statsToExport = {
      total: stats.total,
      ativos: stats.ativos,
      vencidos: stats.vencidos,
      pendentes: stats.pendentes,
      cancelados: stats.cancelados,
      valorTotal: stats.valorTotal,
      valorAtivos: stats.valorAtivos,
    };
    await exportarParaExcel(contratos, statsToExport);
  };

  const handleExportarPDF = () => {
    const statsToExport = {
      total: stats.total,
      ativos: stats.ativos,
      vencidos: stats.vencidos,
      pendentes: stats.pendentes,
      cancelados: stats.cancelados,
      valorTotal: stats.valorTotal,
      valorAtivos: stats.valorAtivos,
    };
    exportarParaPDF(contratos, statsToExport);
  };

  const handleExportarJSON = () => {
    const statsToExport = {
      total: stats.total,
      ativos: stats.ativos,
      vencidos: stats.vencidos,
      pendentes: stats.pendentes,
      cancelados: stats.cancelados,
      valorTotal: stats.valorTotal,
      valorAtivos: stats.valorAtivos,
    };
    exportarParaJSON(contratos, statsToExport);
  };

  // 📱 RENDER MOBILE
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <HeaderMobile />

        <MobileRelatorios
          contratos={contratos}
          refetch={refetch}
          onExportarExcel={handleExportarExcel}
          statusFiltro={statusFiltro}
          onStatusChange={setStatusFiltro}
        />
      </div>
    );
  }

  // 🖥️ RENDER DESKTOP
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header com Botão de Exportar e Recarregar */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Relatórios
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Análise completa de contratos e receitas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refetch}
              variant="outline"
              className="border-slate-300 dark:border-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <DropdownMenuItem
                  onClick={handleExportarExcel}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Baixar em Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportarPDF}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Baixar em PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportarJSON}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Baixar em JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Resumo Executivo - 4 Cards */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
              <CardContent className="pt-4 md:pt-3 pb-4 md:pb-5 px-4 md:px-6">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 text-[var(--sky-trust)]/50 dark:text-[var(--sky-trust)]/50 flex-shrink-0">
                    <FileText className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm lg:text-base text-[var(--steel-light)] dark:text-slate-400 font-semibold uppercase tracking-wider">
                      Total de Contratos
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 truncate">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
              <CardContent className="pt-4 md:pt-3 pb-4 md:pb-5 px-4 md:px-6">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 text-[var(--success-active)]/50 dark:text-[var(--success-active)]/50 flex-shrink-0">
                    <CheckCircle className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm lg:text-base text-[var(--steel-light)] dark:text-slate-400 font-semibold uppercase tracking-wider">
                      Ativos
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 truncate">
                      {stats.ativos}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
              <CardContent className="pt-4 md:pt-3 pb-4 md:pb-5 px-4 md:px-6">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 text-[var(--error-vencido)]/50 dark:text-[var(--error-vencido)]/50 flex-shrink-0">
                    <AlertCircle className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm lg:text-base text-[var(--steel-light)] dark:text-slate-400 font-semibold uppercase tracking-wider">
                      Vencidos
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 truncate">
                      {stats.vencidos}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
              <CardContent className="pt-4 md:pt-3 pb-4 md:pb-5 px-4 md:px-6">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 text-[var(--sky-trust)]/50 dark:text-[var(--sky-trust)]/50 flex-shrink-0">
                    <TrendingUp className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm lg:text-base text-[var(--steel-light)] dark:text-slate-400 font-semibold uppercase tracking-wider">
                      Valor Total
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-50 truncate">
                      {formatarValor(stats.valorTotal)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Filtros de Status */}
          <div className="lg:col-span-2">
            <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              <Button
                onClick={() => setStatusFiltro(null)}
                className={`text-sm whitespace-nowrap flex-shrink-0 ${
                  statusFiltro === null
                    ? "bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white dark:bg-[var(--sky-trust)] dark:hover:bg-[var(--sky-trust)]/90"
                    : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
                }`}
              >
                Todos
              </Button>
              <Button
                onClick={() => setStatusFiltro("ativo")}
                className={`text-sm whitespace-nowrap flex-shrink-0 ${
                  statusFiltro === "ativo"
                    ? "bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white dark:bg-[var(--sky-trust)] dark:hover:bg-[var(--sky-trust)]/90"
                    : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
                }`}
              >
                Ativos
              </Button>
              <Button
                onClick={() => setStatusFiltro("vencido")}
                className={`text-sm whitespace-nowrap flex-shrink-0 ${
                  statusFiltro === "vencido"
                    ? "bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white dark:bg-[var(--sky-trust)] dark:hover:bg-[var(--sky-trust)]/90"
                    : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
                }`}
              >
                Vencidos
              </Button>
              <Button
                onClick={() => setStatusFiltro("pendente")}
                className={`text-sm whitespace-nowrap flex-shrink-0 ${
                  statusFiltro === "pendente"
                    ? "bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white dark:bg-[var(--sky-trust)] dark:hover:bg-[var(--sky-trust)]/90"
                    : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
                }`}
              >
                Pendentes
              </Button>
              <Button
                onClick={() => setStatusFiltro("expirando")}
                className={`text-sm whitespace-nowrap flex-shrink-0 ${
                  statusFiltro === "expirando"
                    ? "bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white dark:bg-[var(--sky-trust)] dark:hover:bg-[var(--sky-trust)]/90"
                    : "bg-white text-black border border-slate-300 hover:bg-slate-100 dark:bg-input/30 dark:text-white dark:border-slate-700 dark:hover:bg-input/50"
                }`}
              >
                Expirando
              </Button>
            </div>
          </div>

          {/* Distribuição por Status */}
          <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-50">
                    Distribuição por Status
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Proporção de contratos por status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {dataStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dataStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-blue-600 dark:text-blue-400 py-8">
                  Nenhum dado disponível
                </p>
              )}
            </CardContent>
          </Card>

          {/* Valor por Status */}
          <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
            <CardHeader>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-50">
                    Valor por Status
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Valor total de contratos em cada status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {dataValor.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dataValor}
                    margin={{ left: 30, right: 50, top: 30, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGridStroke}
                    />
                    <XAxis dataKey="status" stroke={chartStroke} />
                    <YAxis stroke={chartStroke} tick={{ fill: chartStroke }} />
                    <Tooltip formatter={(value: any) => formatarValor(value)} />
                    <Bar dataKey="valor" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-blue-600 dark:text-blue-400 py-8">
                  Nenhum dado disponível
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contratos por Empresa */}
        {dataEmpresa.length > 0 && (
          <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-50">
                    Contratos por Empresa
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Número de contratos em cada empresa
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dataEmpresa}
                  margin={{ left: 30, right: 50, top: 30, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartGridStroke}
                  />
                  <XAxis dataKey="empresa" stroke={chartStroke} />
                  <YAxis stroke={chartStroke} tick={{ fill: chartStroke }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total" />
                  <Bar dataKey="ativos" fill="#10b981" name="Ativos" />
                  <Bar dataKey="vencidos" fill="#ef4444" name="Vencidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Próximos Vencimentos */}
        <Card className="border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
          <CardHeader>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-sla te-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-50">
                  Próximos Vencimentos
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Contratos vencendo nos próximos 30 dias
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {proximosVencimentos.length > 0 ? (
              <div className="rounded-lg overflow-hidden border border-[var(--border-default)] dark:border-slate-700 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-900/30 border-b border-[var(--border-default)] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                        <div className="flex items-center gap-2">
                          <span>Contrato</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                        Empresa
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                        Motorista
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50">
                        Data Vencimento
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-center">
                        Dias Restantes
                      </TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-slate-50 text-right">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proximosVencimentos.map((item) => {
                      return (
                        <TableRow
                          key={item.contrato.id}
                          className="border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30"
                          onClick={() => router.push("/contratos")}
                        >
                          <TableCell className="font-medium text-slate-900 dark:text-slate-50">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                              <span>{item.contrato.titulo}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            {item.contrato.empresa}
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            {item.contrato.motorista}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                item.contrato.status.toUpperCase() === "ATIVO"
                                  ? "bg-green-300 text-green-900 dark:bg-green-800/70 dark:text-green-100 font-semibold"
                                  : item.contrato.status.toUpperCase() ===
                                      "PENDENTE"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                                    : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {item.contrato.status.charAt(0).toUpperCase() +
                                item.contrato.status.slice(1).toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              item.contrato.dataVencimento,
                            ).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full font-semibold ${
                                item.diasRestantes <= 7
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                  : item.diasRestantes <= 15
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
                              }`}
                            >
                              {item.diasRestantes}d
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatarValor(item.contrato.valor)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-blue-600 dark:text-blue-400 py-8">
                Nenhum contrato vencendo nos próximos 30 dias
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
