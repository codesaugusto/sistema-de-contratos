"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RotateCcw,
  AlertCircle,
  CheckCircle,
  FileText,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Contrato, HistoricoContrato } from "@/hooks/use-contratos";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { MobileHistorico } from "@/components/mobile-historico";
import { Empty } from "@/components/ui/empty";
import { contratosApi } from "@/lib/api";

// Historico enriquecido com dados do contrato para exibição
interface HistoricoComContrato extends HistoricoContrato {
  contratoTitulo: string;
}

// Formato interno de exibição compatível com MobileHistorico
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
  detalhes?: { acao?: string; link?: string; label?: string };
}

function inferirTipo(motivo: string): Atividade["tipo"] {
  const m = (motivo ?? "").toLowerCase();
  if (m.includes("criação") || m.includes("criado") || m.includes("novo"))
    return "contrato_criado";
  if (m.includes("atualiz") || m.includes("alteração"))
    return "status_alterado";
  if (m.includes("renov")) return "contrato_renovado";
  if (m.includes("cancelado") || m.includes("vencido"))
    return "status_alterado";
  if (m.includes("pagamento")) return "pagamento_confirmado";
  return "auditoria";
}

function formatarAlteracoes(alt: Record<string, string>): string {
  const entradas = Object.entries(alt);
  if (entradas.length === 0) return "";
  return entradas.map(([campo, valor]) => `${campo}: ${valor}`).join(" · ");
}

function toAtividade(h: HistoricoComContrato): Atividade {
  const descAlteracoes = formatarAlteracoes(h.alteracoes);
  return {
    id: h.id,
    contratoId: h.contratoId,
    tipo: inferirTipo(h.motivo),
    titulo: h.motivo || `Versão ${h.versao}`,
    descricao: descAlteracoes
      ? `${h.contratoTitulo} — ${descAlteracoes}`
      : h.contratoTitulo,
    referencia: h.contratoTitulo,
    realizado_por: "Sistema",
    data: h.dataAlteracao,
    detalhes: {
      label: "Ver Contrato",
      acao: `/contratos/${h.contratoId}`,
    },
  };
}

export default function Historico() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [filtroData, setFiltroData] = useState("");
  const [filtroContratoId, setFiltroContratoId] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string>("");
  const [autenticado, setAutenticado] = useState<boolean | null>(null); // null = verificando
  const [hidratado, setHidratado] = useState(false);

  // Verificar hidratação e token no mount
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
      setHidratado(true);
    };

    verificarAutenticacao();
  }, [router]);

  const carregarHistorico = async () => {
    if (!autenticado) return;

    setLoading(true);
    setErro("");

    try {
      const page = await contratosApi.listar({ size: 200 });
      const lista = Array.isArray(page) ? page : (page?.content ?? []);
      setContratos(lista);

      // Busca historico de todos os contratos em paralelo
      const todos = await Promise.all(
        lista.map((c) =>
          contratosApi
            .historico(c.id)
            .then((hist) =>
              hist.map((h) => ({ ...h, contratoTitulo: c.titulo })),
            )
            .catch((e) => {
              return [] as HistoricoComContrato[];
            }),
        ),
      );

      const merged = todos
        .flat()
        .sort(
          (a, b) =>
            new Date(b.dataAlteracao).getTime() -
            new Date(a.dataAlteracao).getTime(),
        )
        .map(toAtividade);

      setAtividades(merged);
    } catch (e: any) {
      // Verificar se é erro de autenticação
      if (e.status === 401 || e.message?.includes("Token")) {
        setAutenticado(false);
        return;
      }

      setErro(e.message || "Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  };

  // Carregar histórico quando autenticado
  useEffect(() => {
    if (autenticado === true && hidratado) {
      carregarHistorico();
    }
  }, [autenticado, hidratado]);

  const getAtividadeColor = (tipo: Atividade["tipo"]) => {
    switch (tipo) {
      case "contrato_renovado":
        return "border-l-orange-500";
      case "status_alterado":
        return "border-l-blue-500";
      case "pagamento_confirmado":
        return "border-l-green-500";
      case "contrato_criado":
        return "border-l-green-500";
      case "auditoria":
        return "border-l-red-500";
      default:
        return "border-l-slate-500";
    }
  };

  const getAtividadeIcon = (tipo: Atividade["tipo"]) => {
    switch (tipo) {
      case "contrato_renovado":
        return (
          <RotateCcw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      case "status_alterado":
        return (
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "pagamento_confirmado":
        return (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "contrato_criado":
        return <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "auditoria":
        return (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      default:
        return (
          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        );
    }
  };

  const formatarDataRelativa = (data: string) => {
    const hoje = new Date();
    const ontem = new Date(hoje.getTime() - 86400000);
    const dataParse = new Date(data);

    hoje.setHours(0, 0, 0, 0);
    ontem.setHours(0, 0, 0, 0);
    dataParse.setHours(0, 0, 0, 0);

    if (dataParse.getTime() === hoje.getTime()) return "HOJE";
    if (dataParse.getTime() === ontem.getTime()) return "ONTEM";

    return dataParse.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatarHora = (data: string) =>
    new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const agruparPorData = (ativs: Atividade[]) => {
    const grupos: Record<string, Atividade[]> = {};
    ativs.forEach((atv) => {
      const chave = formatarDataRelativa(atv.data);
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(atv);
    });
    return grupos;
  };

  const atividadesFiltradas = atividades.filter((a) => {
    if (filtroData && formatarDataRelativa(a.data) !== filtroData) return false;
    if (filtroContratoId && a.contratoId !== filtroContratoId) return false;
    return true;
  });

  const atividadesAgrupadas = agruparPorData(atividadesFiltradas);

  // Verificando autenticação
  if (autenticado === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
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
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <HeaderMobile />
        <MobileHistorico atividades={atividadesFiltradas} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {erro && (
          <div className="p-4 bg-red-50 dark:bg-slate-900 border border-red-200 dark:border-red-800 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700 dark:text-red-200">
                <strong>Erro:</strong> {erro}
              </p>
              <Button
                onClick={carregarHistorico}
                className="text-xs px-4 py-1.5 font-medium cursor-pointer border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 text-red-700 dark:text-red-200 hover:bg-red-50 dark:hover:bg-slate-700 transition-all h-auto"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Histórico de Atividades
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Acompanhe todas as alterações e ações realizadas no sistema.
          </p>

          {/* Filtros */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-auto bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer flex items-center gap-2">
                  Por Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <DropdownMenuItem
                  onClick={() => setFiltroData("")}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  Todas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFiltroData("HOJE")}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  Hoje
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFiltroData("ONTEM")}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  Ontem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-auto bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer flex items-center gap-2">
                  Por Contrato
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <DropdownMenuItem
                  onClick={() => setFiltroContratoId("")}
                  className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  Todos
                </DropdownMenuItem>
                {contratos.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setFiltroContratoId(c.id)}
                    className="cursor-pointer rounded focus:bg-slate-100 dark:focus:bg-slate-800"
                  >
                    {c.titulo}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-96" />
                  </div>
                </div>
              ))}
          </div>
        ) : Object.keys(atividadesAgrupadas).length === 0 ? (
          <Empty className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Nenhuma atividade encontrada
              </p>
            </CardContent>
          </Empty>
        ) : (
          <div className="space-y-6">
            {Object.entries(atividadesAgrupadas).map(([data, ativs]) => (
              <div key={data}>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {data}
                  </p>
                </div>

                <div className="space-y-4">
                  {ativs.map((atv) => (
                    <div
                      key={atv.id}
                      className={`border-l-4 ${getAtividadeColor(atv.tipo)} bg-white dark:bg-slate-800 rounded-r-lg p-4 transition-all hover:shadow-md`}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 pt-0.5">
                          {getAtividadeIcon(atv.tipo)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                                  {atv.titulo}
                                </h3>
                                <span className="text-xs font-mono text-[var(--sky-trust)] dark:text-sky-400">
                                  {atv.referencia}
                                </span>
                              </div>

                              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                {atv.descricao}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <span>📌</span>
                                  {atv.realizado_por}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {formatarHora(atv.data)}
                              </p>

                              {atv.detalhes?.label && atv.detalhes?.acao && (
                                <Link href={atv.detalhes.acao}>
                                  <Button className="text-xs px-4 py-1.5 font-medium cursor-pointer border border-[var(--border-default)] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-[var(--sky-trust)] hover:text-white hover:border-[var(--sky-trust)] transition-all h-auto">
                                    {atv.detalhes.label}
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
