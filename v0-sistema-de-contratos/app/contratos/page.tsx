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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  User,
  Search,
  Filter,
  ChevronLeft,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { MobileContratos } from "@/components/mobile-contratos";
import { Empty } from "@/components/ui/empty";
import { useRouter } from "next/navigation";
import { contratosApi } from "@/lib/api";

export default function ContratosList() {
  const isMobile = useIsMobile();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const router = useRouter();

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

    contratosApi
      .listar()
      .then((res) => {
        // Suporta resposta paginada { content: [] } ou array direto
        const lista = Array.isArray(res) ? res : (res.content ?? []);
        setContratos(lista);
      })
      .catch((e) => {})
      .finally(() => setLoading(false));
  }, [autenticado]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [statusFiltro, filtro]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este contrato?")) {
      try {
        await contratosApi.deletar(id);
        setContratos((prev) => prev.filter((c) => c.id !== id));
      } catch (e) {
        alert("Erro ao deletar contrato. Tente novamente.");
      }
    }
  };

  const contratosFiltrados = contratos.filter((c) => {
    const matchText =
      (c.titulo ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
      (c.empresa ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
      (c.motorista ?? "").toLowerCase().includes(filtro.toLowerCase());

    const statusNorm = (c.status ?? "").toLowerCase();
    const matchStatus =
      statusFiltro === "todos" ||
      statusNorm === statusFiltro ||
      // aba "ativo" também mostra contratos expirando
      (statusFiltro === "ativo" && statusNorm === "expirando");

    return matchText && matchStatus;
  });

  const totalPaginas = Math.ceil(contratosFiltrados.length / itensPorPagina);
  const contratosExibidos = contratosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  // Considera "expirando" como contrato ativo em vigor
  const isAtivo = (status: string) => {
    const s = (status ?? "").toLowerCase();
    return s === "ativo" || s === "expirando";
  };

  // Cálculos para cards de resumo
  const totalAtivos = contratos.filter((c) => isAtivo(c.status)).length;
  const valorEmVigor = contratos
    .filter((c) => isAtivo(c.status))
    .reduce((sum, c) => sum + c.valor, 0);

  const hoje = new Date();
  const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  const vencendoEsteMes = contratos.filter((c) => {
    const dataVencimento = new Date(c.dataVencimento);
    return (
      dataVencimento.getMonth() === hoje.getMonth() &&
      dataVencimento.getFullYear() === hoje.getFullYear() &&
      dataVencimento.getTime() >= hoje.getTime()
    );
  }).length;

  const getStatusColor = (status: string) => {
    switch ((status ?? "").toLowerCase()) {
      case "ativo":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "vencido":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "pendente":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "cancelado":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch ((status ?? "").toLowerCase()) {
      case "ativo":
        return "bg-green-500 text-white";
      case "expirando":
        return "bg-orange-500 text-white";
      case "vencido":
        return "bg-red-500 text-white";
      case "pendente":
        return "bg-yellow-500 text-white";
      case "cancelado":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getContractIconColor = (id: string) => {
    const icons = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    // Gera um índice determinístico baseado no ID
    const hash = id.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return icons[hash % icons.length];
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <HeaderMobile />
        {loading || testLoading ? (
          <div className="p-4 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
          </div>
        ) : (
          <MobileContratos contratos={contratos} onDelete={handleDelete} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <Tabs
              value={statusFiltro}
              onValueChange={setStatusFiltro}
              className="w-full md:w-auto"
            >
              <TabsList className="w-auto bg-transparent gap-2">
                <TabsTrigger
                  className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                  value="todos"
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger
                  className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                  value="ativo"
                >
                  Ativos
                </TabsTrigger>
                <TabsTrigger
                  className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                  value="pendente"
                >
                  Pendentes
                </TabsTrigger>
                <TabsTrigger
                  className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                  value="vencido"
                >
                  Vencidos
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 flex-1 md:flex-none">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Filtrar contratos..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 border border-[var(--border-default)] focus:outline-none focus:ring-2 focus:ring-[var(--sky-trust)] dark:bg-slate-900 dark:text-slate-50"
                />
              </div>
              <Link href="/contratos/novo">
                <Button className="w-full md:w-auto bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Contrato
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Mostrando {contratosExibidos.length} de {contratosFiltrados.length}{" "}
            contrato(s)
          </p>
        </div>

        {/* Tabela de Contratos */}
        {loading || testLoading ? (
          <Card className="bg-white dark:bg-slate-900 border border-[var(--border-default)] p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[var(--border-default)]">
                    <TableHead className="px-2 sm:px-3 md:px-2">
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="px-2 sm:px-3 md:px-1 text-center">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableHead>
                    <TableHead className="px-2 sm:px-3 md:px-1 text-center">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableHead>
                    <TableHead className="px-2 sm:px-3 md:px-1">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead className="px-2 sm:px-3 md:px-1">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead className="px-2 sm:px-3 md:px-1 text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow
                        key={i}
                        className="border-b border-[var(--border-default)]"
                      >
                        <TableCell className="px-2 sm:px-3 md:px-2 py-3 sm:py-4 md:py-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-3 w-32" />
                              <Skeleton className="h-2 w-24 hidden sm:block md:hidden" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2 text-center">
                          <Skeleton className="h-3 w-24 mx-auto" />
                        </TableCell>
                        <TableCell className="px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2 text-center">
                          <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                        </TableCell>
                        <TableCell className="px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2">
                          <Skeleton className="h-3 w-24" />
                        </TableCell>
                        <TableCell className="px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2">
                          <Skeleton className="h-3 w-20" />
                        </TableCell>
                        <TableCell className="px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : contratosFiltrados.length === 0 ? (
          <Empty className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-900 dark:text-slate-200 font-medium text-lg">
                Nenhum contrato encontrado
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {filtro || statusFiltro !== "todos"
                  ? "Tente ajustar os filtros"
                  : "Crie seu primeiro contrato para começar"}
              </p>
            </CardContent>
          </Empty>
        ) : (
          <>
            <Card className="bg-white dark:border-blue-800/50 dark:bg-slate-950 border border-[var(--border-default)] p-4 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className=" border-b border-[var(--border-default)]">
                      <TableHead className="text-slate-700 dark:text-slate-300 px-2 sm:px-3 md:px-2 font-semibold text-xs sm:text-sm md:text-xs whitespace-nowrap uppercase tracking-wider">
                        NOME DO CONTRATO
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-center text-xs sm:text-sm md:text-xs px-2 sm:px-3 md:px-1 whitespace-nowrap uppercase tracking-wider">
                        EMPRESA
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-center text-xs sm:text-sm md:text-xs px-2 sm:px-3 md:px-1 whitespace-nowrap uppercase tracking-wider">
                        STATUS
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm md:text-xs px-2 sm:px-3 md:px-1 whitespace-nowrap uppercase tracking-wider">
                        VENCIMENTO
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm md:text-xs px-2 sm:px-3 md:px-1 whitespace-nowrap uppercase tracking-wider">
                        VALOR TOTAL
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm md:text-xs px-2 sm:px-3 md:px-1 text-right whitespace-nowrap uppercase tracking-wider">
                        AÇÕES
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratosExibidos.map((contrato) => (
                      <TableRow
                        key={contrato.id}
                        className="border-b border-[var(--border-default)] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        onClick={() => router.push(`/contratos/${contrato.id}`)}
                      >
                        <TableCell className="font-medium px-2 sm:px-3 md:px-2 py-3 sm:py-4 md:py-2">
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-2">
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-lg ${getContractIconColor(contrato.id)} flex items-center justify-center flex-shrink-0`}
                            >
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-slate-900 dark:text-slate-50 font-medium text-xs sm:text-sm md:text-xs truncate">
                                {contrato.titulo}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block md:hidden truncate">
                                {contrato.descricao}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-900 dark:text-slate-100 text-center px-2 sm:px-3 md:px-1 text-xs sm:text-sm md:text-xs py-3 sm:py-4 md:py-2 whitespace-nowrap">
                          <span className="hidden md:inline">
                            {contrato.empresa}
                          </span>
                          <span className="md:hidden text-xs">
                            {contrato.empresa.substring(0, 8)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 sm:px-3 md:px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(contrato.status)}`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current" />
                            <span className="hidden sm:inline md:inline">
                              {getStatusLabel(contrato.status)}
                            </span>
                            <span className="sm:hidden">
                              {getStatusLabel(contrato.status).substring(0, 3)}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-900 dark:text-slate-100 px-2 sm:px-3 md:px-1 text-xs sm:text-sm md:text-xs py-3 sm:py-4 md:py-2 whitespace-nowrap">
                          {formatarData(contrato.dataVencimento)}
                        </TableCell>
                        <TableCell className="text-slate-900 dark:text-slate-50 font-semibold px-2 sm:px-3 md:px-1 text-xs sm:text-sm md:text-xs py-3 sm:py-4 md:py-2 whitespace-nowrap tabular-nums">
                          {formatarValor(contrato.valor)}
                        </TableCell>
                        <TableCell className="px-2 sm:px-3 md:px-1 py-3 sm:py-4 md:py-2">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-1.5">
                            <Link
                              href={`/contratos/${contrato.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6 p-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 cursor-pointer transition-all"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-3" />
                              </Button>
                            </Link>
                            <Link
                              href={`/contratos/${contrato.id}/editar`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6 p-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 cursor-pointer transition-all"
                              >
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-3" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 cursor-pointer transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(contrato.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(paginaAtual - 1)}
                >
                  Anterior
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPaginas }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={paginaAtual === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaginaAtual(i + 1)}
                      className="w-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(paginaAtual + 1)}
                >
                  Próximo
                </Button>
              </div>
            )}
          </>
        )}

        {/* Cards de Resumo */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:scale-105 transition-all bg-white dark:bg-slate-950 dark:border-blue-800/50 border border-[var(--border-default)] p-6 cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Total Ativos
                  </p>
                  <p className="xl:text-3xl md:text-xl font-bold text-slate-900 dark:text-slate-50 mt-2">
                    {totalAtivos}
                  </p>
                </div>
                <div className="w-12 h-12 text-slate-300 dark:text-slate-600">
                  <FileText className="w-12 h-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all bg-white dark:border-blue-800/50 dark:bg-slate-950 border border-[var(--border-default)] p-6 cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Valor em Vigor
                  </p>
                  <p className="xl:text-3xl md:text-xl font-bold text-slate-900 dark:text-slate-50 mt-2 tabular-nums">
                    {formatarValor(valorEmVigor)}
                  </p>
                </div>
                <div className="w-12 h-12 text-slate-300 dark:text-slate-600">
                  <DollarSign className="w-12 h-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all bg-white dark:border-blue-800/50 dark:bg-slate-950 border border-[var(--border-default)] p-6 cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Vencendo Este Mês
                  </p>
                  <p className="xl:text-3xl md:text-xl font-bold text-slate-900 dark:text-slate-50 mt-2">
                    {vencendoEsteMes}
                  </p>
                </div>
                <div className="w-12 h-12 text-slate-300 dark:text-slate-600">
                  <AlertCircle className="w-12 h-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
