"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  FileText,
  Clock,
  Bell,
  TrendingUp,
  Plus,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  FileJson,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { MobileDashboard } from "@/components/mobile-dashboard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ContractTimeline } from "@/components/dashboard/ContractTimeline";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import {
  exportarParaExcel,
  exportarParaPDF,
  exportarParaJSON,
} from "@/lib/export-utils";
import { relatoriosApi, contratosApi } from "@/lib/api";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalContratos: 0,
    contratosAtivos: 0,
    proximosVencimentos: 0,
    pendentes: 0,
    valorTotal: 0,
    totalClientes: 0,
    taxaRenovacao: 0,
    renovacao: 0,
    vencidos: 0,
    contratosFinalizados: 0,
    valorMedio: 0,
  });
  const [contratos, setContratos] = useState<any[]>([]);
  const [revenueByCompany, setRevenueByCompany] = useState<any[]>([]);

  // Verificar autenticação
  useEffect(() => {
    const verificarAutenticacao = () => {
      const usuario = localStorage.getItem("@contratos:usuario");
      if (!usuario) {
        // Limpar também o cookie para sincronizar
        document.cookie = "contratos-auth=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "access_token=; path=/; max-age=0; SameSite=Strict";
        setAutenticado(false);
        const timer = setTimeout(() => {
          router.replace("/login");
        }, 200);
        return () => clearTimeout(timer);
      }
      setAutenticado(true);
    };

    verificarAutenticacao();
  }, [router]);

  useEffect(() => {
    if (autenticado !== true) return;

    // Busca stats e contratos em paralelo da API
    Promise.all([
      relatoriosApi.getDashboard().catch(() => null),
      contratosApi.listar({ size: 200 }).catch(() => ({ content: [] })),
    ]).then(([apiStats, page]) => {
      const lista = Array.isArray(page) ? page : (page?.content ?? []);
      setContratos(lista);

      // "expirando" também é considerado ativo em vigor
      const isAtivo = (s: string) => {
        const norm = (s ?? "").toLowerCase();
        return norm === "ativo" || norm === "expirando";
      };

      // Sempre calcula localmente a partir da lista — mais confiável que depender do /dashboard/stats
      const hoje = new Date();
      const ativos = lista.filter((c: any) => isAtivo(c.status));
      const expirando = lista.filter(
        (c: any) => (c.status ?? "").toLowerCase() === "expirando",
      );
      const proximosVencimentos =
        expirando.length > 0
          ? expirando.length
          : lista.filter((c: any) => {
              const diasAte = Math.ceil(
                (new Date(c.dataVencimento).getTime() - hoje.getTime()) /
                  (1000 * 60 * 60 * 24),
              );
              return diasAte <= 30 && diasAte > 0 && isAtivo(c.status);
            }).length;

      setStats({
        totalContratos: lista.length,
        contratosAtivos: ativos.length,
        proximosVencimentos,
        pendentes: lista.filter(
          (c: any) => (c.status ?? "").toLowerCase() === "pendente",
        ).length,
        valorTotal: ativos.reduce((s: number, c: any) => s + (c.valor || 0), 0),
        totalClientes: new Set(lista.map((c: any) => c.empresa)).size,
        taxaRenovacao: 0,
        renovacao: 0,
        vencidos: lista.filter(
          (c: any) => (c.status ?? "").toLowerCase() === "vencido",
        ).length,
        contratosFinalizados: 0,
        valorMedio:
          lista.length > 0
            ? Math.round(
                lista.reduce((s: number, c: any) => s + (c.valor || 0), 0) /
                  lista.length,
              )
            : 0,
      });

      // Agrupa receitas por empresa (ativos + expirando)
      const receitas: Record<string, number> = {};
      lista.forEach((c: any) => {
        if (isAtivo(c.status)) {
          receitas[c.empresa] = (receitas[c.empresa] || 0) + (c.valor || 0);
        }
      });
      setRevenueByCompany(
        Object.entries(receitas).map(([name, valor]) => ({ name, valor })),
      );
    });
  }, [autenticado]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const chartStroke = isDark ? "#94a3b8" : "#000000";
  const chartGridStroke = isDark ? "#4b5563" : "#e2e8f0";

  const formatarNumero = (valor: number): string => {
    if (valor >= 1000000000) {
      return (valor / 1000000000).toFixed(1) + "B";
    } else if (valor >= 1000000) {
      return (valor / 1000000).toFixed(1) + "M";
    } else if (valor >= 1000) {
      return (valor / 1000).toFixed(1) + "K";
    }
    return valor.toString();
  };

  const handleExportarExcel = async () => {
    const statsToExport = {
      total: stats.totalContratos,
      ativos: stats.contratosAtivos,
      vencidos: contratos.filter(
        (c) => (c.status ?? "").toLowerCase() === "vencido",
      ).length,
      pendentes: stats.pendentes,
      cancelados: contratos.filter(
        (c) => (c.status ?? "").toLowerCase() === "cancelado",
      ).length,
      valorTotal: stats.valorTotal,
      valorAtivos: contratos
        .filter((c) => {
          const s = (c.status ?? "").toLowerCase();
          return s === "ativo" || s === "expirando";
        })
        .reduce((sum, c) => sum + c.valor, 0),
    };
    await exportarParaExcel(contratos, statsToExport);
  };

  const handleExportarPDF = () => {
    const statsToExport = {
      total: stats.totalContratos,
      ativos: stats.contratosAtivos,
      vencidos: contratos.filter(
        (c) => (c.status ?? "").toLowerCase() === "vencido",
      ).length,
      pendentes: stats.pendentes,
      cancelados: contratos.filter(
        (c) => (c.status ?? "").toLowerCase() === "cancelado",
      ).length,
      valorTotal: stats.valorTotal,
      valorAtivos: contratos
        .filter((c) => {
          const s = (c.status ?? "").toLowerCase();
          return s === "ativo" || s === "expirando";
        })
        .reduce((sum, c) => sum + c.valor, 0),
    };
    exportarParaPDF(contratos, statsToExport);
  };

  const handleExportarJSON = () => {
    const statsToExport = {
      total: stats.totalContratos,
      ativos: stats.contratosAtivos,
      vencidos: contratos.filter(
        (c) => (c.status ?? "").toLowerCase() === "vencido",
      ).length,
      pendentes: stats.pendentes,
      cancelados: contratos.filter(
        (c) => (c.status ?? "").toLowerCase() === "cancelado",
      ).length,
      valorTotal: stats.valorTotal,
      valorAtivos: contratos
        .filter((c) => {
          const s = (c.status ?? "").toLowerCase();
          return s === "ativo" || s === "expirando";
        })
        .reduce((sum, c) => sum + c.valor, 0),
    };
    exportarParaJSON(contratos, statsToExport);
  };

  // Verificando autenticação
  if (autenticado === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Sem autenticação
  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">
            Sessão expirada
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
            Você será redirecionado para a página de login...
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer"
          >
            Ir para Login
          </Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <HeaderMobile />
        <MobileDashboard
          stats={stats}
          contratos={contratos}
          estatisticasEmpresas={revenueByCompany}
          crescimentoVendas={12.5}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => router.push("/contratos")}
            className="cursor-pointer"
          >
            <MetricCard
              icon={<FileText className="w-5 h-5" />}
              value={formatarNumero(stats.totalContratos)}
              label="Total de Contratos"
              color="blue"
            />
          </div>

          <div
            onClick={() => router.push("/contratos?status=ativo")}
            className="cursor-pointer"
          >
            <MetricCard
              icon={<Clock className="w-5 h-5" />}
              value={formatarNumero(stats.contratosAtivos)}
              label="Contratos Ativos"
              color="blue"
            />
          </div>

          <div
            onClick={() => router.push("/contratos?status=expirando")}
            className="cursor-pointer"
          >
            <MetricCard
              icon={<AlertCircle className="w-5 h-5" />}
              value={formatarNumero(stats.proximosVencimentos)}
              label="Próximos Vencimentos"
              color="blue"
            />
          </div>

          <div
            onClick={() => router.push("/relatorios")}
            className="cursor-pointer"
          >
            <MetricCard
              icon={<TrendingUp className="w-5 h-5" />}
              value={`R$ ${formatarNumero(stats.valorTotal)}`}
              label="Receita Total"
              color="blue"
            />
          </div>

          <div
            onClick={() => router.push("/contratos")}
            className="cursor-pointer"
          >
            <MetricCard
              icon={<Bell className="w-5 h-5" />}
              value={formatarNumero(stats.totalClientes)}
              label="Clientes Únicos"
              color="blue"
            />
          </div>

          <div
            onClick={() => router.push("/historico")}
            className="cursor-pointer"
          >
            <MetricCard
              icon={<TrendingUp className="w-5 h-5" />}
              value={`${stats.taxaRenovacao}%`}
              label="Taxa Renovação"
              color="blue"
            />
          </div>

          <div className="cursor-pointer">
            <MetricCard
              icon={<AlertCircle className="w-5 h-5" />}
              value={formatarNumero(stats.vencidos)}
              label="Contratos Vencidos"
              color="blue"
            />
          </div>

          <div className="cursor-pointer">
            <MetricCard
              icon={<DollarSign className="w-5 h-5" />}
              value={`R$ ${formatarNumero(stats.valorMedio)}`}
              label="Ticket Médio"
              color="blue"
            />
          </div>
        </div>

        {/* Seção de Receitas */}
        {contratos.length > 0 && (
          <>
            <div className="mt-16 mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 inline-flex items-center gap-2">
                Análise de Receitas
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Receita por Empresa */}
              {revenueByCompany.length > 0 && (
                <div className="rounded-lg border border-[var(--border-default)] bg-white dark:bg-slate-950 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    <div>
                      <h3 className="font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        Receita por Empresa
                      </h3>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                        Distribuição de receitas entre empresas
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={revenueByCompany}
                        margin={{ left: 30, right: 50, top: 30, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartGridStroke}
                        />
                        <XAxis dataKey="name" stroke={chartStroke} />
                        <YAxis
                          stroke={chartStroke}
                          tick={{ fill: chartStroke }}
                        />
                        <Tooltip
                          formatter={(value) =>
                            `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                          }
                        />
                        <Bar
                          dataKey="valor"
                          fill="#0890bb"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Status dos Contratos */}
              <div className="rounded-lg border border-[var(--border-default)] bg-white dark:bg-slate-950 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  <div>
                    <h3 className="font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Distribuição de Status
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                      Contratos por status
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart
                      margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                    >
                      <Pie
                        data={[
                          {
                            name: "Ativos",
                            value: stats.contratosAtivos,
                            color: "#10b981",
                          },
                          {
                            name: "Expirando",
                            value: stats.proximosVencimentos,
                            color: "#f59e0b",
                          },
                          {
                            name: "Pendentes",
                            value: stats.pendentes,
                            color: "#8b5cf6",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <span>Ativos: {stats.contratosAtivos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>Expirando: {stats.proximosVencimentos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                      <span>Pendentes: {stats.pendentes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ciclo de Vida - Timeline */}
            {contratos.length > 0 && (
              <>
                <div className="mt-16 mb-6">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Ciclo de Vida de Contratos
                  </h2>
                </div>

                {/* Grid com Métrica + Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                  {/* Card de Métrica - Média do Ciclo */}
                  <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-950 border border-[var(--border-default)] rounded-lg p-8 h-full flex flex-col justify-center min-h-[280px]">
                      <div>
                        <p className="text-xs font-semibold text-[var(--sky-trust)] uppercase tracking-wider mb-4">
                          Média do Ciclo
                        </p>
                        <p className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                          {Math.round(
                            contratos.reduce((sum, c) => {
                              const inicio = new Date(c.criadoEm).getTime();
                              const fim = new Date(c.dataVencimento).getTime();
                              const dias = Math.floor(
                                (fim - inicio) / (1000 * 60 * 60 * 24),
                              );
                              return sum + dias;
                            }, 0) / contratos.length,
                          )}
                        </p>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
                          dias
                        </p>
                      </div>
                      <div className="pt-4 border-t border-[var(--border-default)]">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Tempo médio entre criação e vencimento
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline - Full */}
                  <div className="lg:col-span-2">
                    {contratos.length > 0 && (
                      <ContractTimeline
                        status={contratos[0].status}
                        dataCriacao={contratos[0].criadoEm}
                        dataVencimento={contratos[0].dataVencimento}
                        createdContractsCount={contratos.length}
                        activeContractsCount={
                          contratos.filter((c) => {
                            const s = (c.status ?? "").toLowerCase();
                            return s === "ativo" || s === "expirando";
                          }).length
                        }
                        expiringContractsCount={
                          contratos.filter(
                            (c) =>
                              (c.status ?? "").toLowerCase() === "expirando",
                          ).length
                        }
                        expiredContractsCount={
                          contratos.filter((c) => {
                            const dataVencimento = new Date(c.dataVencimento);
                            const hoje = new Date();
                            return dataVencimento.getTime() < hoje.getTime();
                          }).length
                        }
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Resumo de Receitas */}
            {revenueByCompany.length > 0 && (
              <div className="mb-8 bg-white dark:bg-slate-950 border border-[var(--border-default)] rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Resumo de Receitas por Empresa
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Detalhamento das receitas de cada empresa
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 px-3 bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer rounded-md text-sm font-medium">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-lg">
                      <DropdownMenuItem
                        onClick={handleExportarExcel}
                        className="cursor-pointer my-1 rounded"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Baixar em Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleExportarPDF}
                        className="cursor-pointer my-1 rounded"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Baixar em PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleExportarJSON}
                        className="cursor-pointer my-1 rounded"
                      >
                        <FileJson className="w-4 h-4 mr-2" />
                        Baixar em JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="overflow-x-auto py-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border-default)]">
                        <th className="text-left py-3 px-6 text-xs font-semibold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                          EMPRESA
                        </th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                          CONTRATOS
                        </th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                          RECEITA TOTAL
                        </th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                          CRESCIMENTO
                        </th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueByCompany.map((company, index) => {
                        const contractCount = contratos.filter((c: any) => {
                          const s = (c.status ?? "").toLowerCase();
                          return (
                            c.empresa === company.name &&
                            (s === "ativo" || s === "expirando")
                          );
                        }).length;
                        const initials = company.name
                          .split(" ")
                          .map((word: string) => word[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        return (
                          <tr
                            key={index}
                            className="border-b border-[var(--border-default)] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                            onClick={() => router.push("/contratos")}
                          >
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-[var(--border-default)]">
                                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    {initials}
                                  </span>
                                </div>
                                <span className="font-medium text-slate-900 dark:text-slate-50">
                                  {company.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className="text-slate-700 dark:text-slate-300">
                                {contractCount}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right">
                              <span className="font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                                R$ {formatarNumero(company.valor)}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className="text-sm font-semibold text-[var(--success-active)] dark:text-emerald-400">
                                +18%
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                                ATIVO
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-center">
                  <Link href="/relatorios">
                    <button className="text-[var(--sky-trust)] dark:text-sky-400 hover:text-[var(--sky-trust)]/80 dark:hover:text-sky-300 text-sm font-semibold cursor-pointer transition-colors">
                      Ver todos os registros
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        {stats.totalContratos === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-2 border-blue-200 dark:border-blue-800/50 bg-white/50 dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-300">
                    Bem-vindo ao ContratoApp
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-400">
                    Gerenciador de contratos inteligente para motoristas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Organize todos os seus contratos em um único lugar. Receba
                    notificações automáticas de vencimentos, acompanhe o
                    histórico de alterações e gere relatórios detalhados.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href="/contratos/novo">
                      <div className="flex gap-3 border-2 border-blue-200 dark:border-blue-800/50 rounded-lg p-3 cursor-pointer active:scale-102 transition-transform hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white">
                            Cadastrar Contrato
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Adicione novos contratos
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/contratos">
                      <div className="flex gap-3 border-2 border-blue-200 dark:border-blue-800/50 rounded-lg p-3 cursor-pointer active:scale-102 transition-transform hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white">
                            Acompanhar Status
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Monitore vencimentos
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/relatorios">
                      <div className="flex gap-3 border-2 border-blue-200 dark:border-blue-800/50 rounded-lg p-3 cursor-pointer active:scale-102 transition-transform hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white">
                            Gerar Relatórios
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Análise completa
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/notificacoes">
                      <div className="flex gap-3 border-2 border-blue-200 dark:border-blue-800/50 rounded-lg p-3 cursor-pointer active:scale-102 transition-transform hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900 dark:text-white">
                            Alertas Automáticos
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Nunca perca prazos
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-blue-700 dark:bg-blue-600 text-white border-0">
                <CardHeader>
                  <CardTitle>Começar Agora</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-50 mb-4">
                    Crie seu primeiro contrato e comece a gerenciar melhor.
                  </p>
                  <Link href="/contratos/novo" className="w-full block">
                    <Button className="w-full cursor-pointer bg-white text-blue-700 hover:bg-slate-100 dark:hover:bg-slate-100">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Contrato
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-800/50">
                <CardHeader>
                  <CardTitle className="text-base text-blue-700 dark:text-blue-400">
                    Próximas Ações
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                  <p>Nenhum contrato ainda. Crie um novo para começar.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
