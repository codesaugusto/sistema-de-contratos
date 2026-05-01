"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { ChevronLeft, AlertCircle, Clock, Check, Calendar } from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { MobileNotificacoes } from "@/components/mobile-notificacoes";
import { notificacoesApi, type Notificacao } from "@/lib/api/notificacoes";
import { contratosApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";

export default function Notificacoes() {
  const isMobile = useIsMobile();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "nao-lidas" | "lidas">(
    "nao-lidas",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // Carrega notificações e contratos da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carrega notificações
        let dados: Notificacao[];
        if (filtro === "nao-lidas") {
          dados = await notificacoesApi.listarNaoLidas();
        } else {
          dados = await notificacoesApi.listar();
          if (filtro === "lidas") {
            dados = dados.filter((n) => n.lida);
          }
        }
        setNotificacoes(dados);

        // Carrega contratos para calcular diasAntecedencia
        const contratosData = await contratosApi.listar();
        setContratos(contratosData);
      } catch (err) {
        const mensagem =
          err instanceof ApiError
            ? `Erro ${err.status}: ${err.message}`
            : err instanceof Error
              ? err.message
              : "Erro ao carregar notificações";
        setError(mensagem);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    setPaginaAtual(1); // Reseta para primeira página ao mudar filtro
  }, [filtro]);

  // Calcula dias de antecedência baseado na data de vencimento do contrato
  const calcularDiasAntecedencia = (contratoId: string): number | null => {
    const contrato = contratos.find((c) => c.id === contratoId);
    if (!contrato) return null;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataVencimento = new Date(contrato.dataVencimento);
    dataVencimento.setHours(0, 0, 0, 0);

    const diffMs = dataVencimento.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDias;
  };

  // Marca uma notificação como lida ou não lida na API
  const toggleLido = async (id: string, lidoAtual: boolean) => {
    try {
      const novoStatus = !lidoAtual;

      // Otimistic update - atualiza UI imediatamente
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: novoStatus } : n)),
      );

      // Chama o endpoint específico conforme o novo status
      if (novoStatus) {
        await notificacoesApi.marcarComoLida(id);
      } else {
        await notificacoesApi.marcarComoNaoLida(id);
      }
    } catch (err) {
      // Se falhar, recarrega as notificações
      // Recarrega para sincronizar com o servidor
      const dados = await notificacoesApi.listar().catch(() => []);
      setNotificacoes(dados);
    }
  };

  // Marca todas as notificações como lidas na API
  const marcarTudasComoLidas = async () => {
    try {
      // Otimistic update
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));

      // Chama a API
      await notificacoesApi.marcarTodasComoLidas();
    } catch (err) {
      // Recarrega para sincronizar
      const dados = await notificacoesApi.listar().catch(() => []);
      setNotificacoes(dados);
    }
  };

  // Remove uma notificação da lista (local apenas)
  const deletarNotificacao = (id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  };

  const notificacoesFiltradas = notificacoes;
  const totalPaginas = Math.ceil(notificacoesFiltradas.length / itensPorPagina);
  const notificacoesExibidas = notificacoesFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    switch (tipoLower) {
      case "vencimento":
        return "border-l-red-500";
      case "renovacao":
        return "border-l-green-500";
      case "aviso":
        return "border-l-orange-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    switch (tipoLower) {
      case "vencimento":
        return "URGENTE";
      case "renovacao":
        return "SISTEMA";
      case "aviso":
        return "ATENÇÃO";
      default:
        return tipo.toUpperCase();
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    switch (tipoLower) {
      case "vencimento":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      case "renovacao":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "aviso":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    }
  };

  const getTipoIcon = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    switch (tipoLower) {
      case "vencimento":
        return (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      case "renovacao":
        return <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "aviso":
        return (
          <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      default:
        return (
          <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        );
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatarHora = (data: string) => {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
        <HeaderMobile />
        <MobileNotificacoes
          notificacoes={notificacoes}
          filtro={filtro}
          onFiltro={setFiltro}
          onMarcarLido={toggleLido}
          onDeletar={deletarNotificacao}
          onMarcarTudasComoLidas={marcarTudasComoLidas}
          calcularDiasAntecedencia={calcularDiasAntecedencia}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header com Filtros e Botão de Marcar Tudo */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Tabs
            value={filtro}
            onValueChange={(value) =>
              setFiltro(value as "todos" | "nao-lidas" | "lidas")
            }
            className="w-auto"
          >
            <TabsList className="w-auto bg-transparent gap-2">
              <TabsTrigger
                className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                value="todos"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger
                className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                value="nao-lidas"
              >
                Não Lidas
              </TabsTrigger>
              <TabsTrigger
                className="text-sm ps-3 pe-3 py-1.5 border border-[var(--border-default)] data-[state=active]:!bg-[var(--sky-trust)] data-[state=active]:!text-white data-[state=active]:!border-[var(--sky-trust)] data-[state=inactive]:!bg-slate-50 dark:data-[state=inactive]:!bg-slate-700 data-[state=inactive]:!text-slate-700 dark:data-[state=inactive]:!text-slate-300 dark:!border-slate-600 transition-all"
                value="lidas"
              >
                Lidas
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            {notificacoesFiltradas.filter((n) => !n.lida).length > 0 && (
              <Button
                onClick={marcarTudasComoLidas}
                className="text-sm text-[var(--sky-trust)] hover:text-[var(--sky-trust)]/80 dark:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)]/80 cursor-pointer font-medium flex items-center gap-1 bg-transparent hover:bg-transparent border-0 h-auto p-0"
              >
                <Check className="w-4 h-4" />
                Marcar tudo como lido
              </Button>
            )}
          </div>
        </div>

        {/* Notificações */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-800 dark:text-red-300">
              <AlertCircle className="inline w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="border-l-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-r-lg p-4 flex gap-4 items-start"
                  >
                    <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-5 w-16 rounded" />
                        </div>
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-48" />
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Skeleton className="h-8 w-20 rounded" />
                      <Skeleton className="h-8 w-24 rounded" />
                    </div>
                  </div>
                ))}
            </div>
          ) : notificacoesFiltradas.length === 0 ? (
            <Empty className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AlertCircle className="w-6 h-6 text-slate-400" />
                </EmptyMedia>
                <EmptyTitle>Nenhuma notificação</EmptyTitle>
                <EmptyDescription>
                  {filtro === "nao-lidas"
                    ? "Você está em dia com todas as notificações!"
                    : "Nenhuma notificação para exibir"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="space-y-3">
                {notificacoesExibidas.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border-l-4 cursor-pointer ${getTipoColor(notif.tipo)} bg-white dark:bg-slate-800 rounded-r-lg p-4 transition-all hover:shadow-md flex gap-4 items-start ${notif.lida ? "opacity-70" : ""}`}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      {getTipoIcon(notif.tipo)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2 flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                            {notif.tituloContrato}
                          </h3>
                          <span
                            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${getTipoBadgeColor(notif.tipo)} flex-shrink-0`}
                          >
                            {getTipoBadge(notif.tipo)}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
                          {formatarHora(notif.dataNotificacao)}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {notif.mensagem}
                      </p>
                      {notif.diasAntecedencia !== null ||
                      calcularDiasAntecedencia(notif.contratoId) !== null ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dias de antecedência:{" "}
                          <span className="font-medium">
                            {notif.diasAntecedencia ??
                              calcularDiasAntecedencia(notif.contratoId)}
                          </span>
                        </p>
                      ) : null}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/contratos/${notif.contratoId}`}>
                        <Button className="cursor-pointer bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white px-4 py-1.5 h-auto text-xs font-medium rounded-md transition-all">
                          Ver Contrato
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => toggleLido(notif.id, notif.lida)}
                        className="text-xs px-3 py-1.5 h-auto border border-[var(--border-default)] bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 dark:border-slate-600 cursor-pointer rounded-md transition-all font-medium"
                      >
                        {notif.lida ? "Marcar não lida" : "Marcar como lida"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                    disabled={paginaAtual === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
