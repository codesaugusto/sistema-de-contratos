"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Clock,
  FileText,
  Edit3,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import type { HistoricoContrato } from "@/hooks/use-contratos";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { useIsMobile } from "@/components/ui/use-mobile";
import { contratosApi } from "@/lib/api";

// Interface local estendida com acao
interface HistoricoContratoExtended extends HistoricoContrato {
  acao?: string;
}

export default function HistoricoContrato() {
  const params = useParams();
  const id = params.id as string;
  const isMobile = useIsMobile();

  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [historico, setHistorico] = useState<HistoricoContratoExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Buscar contrato
        const contratoData = await contratosApi.buscarPorId(id);
        console.log("Contrato carregado:", contratoData);
        setContrato(contratoData);

        // Buscar histórico
        const historicoData = await contratosApi.historico(id);
        console.log("Histórico carregado:", historicoData);

        // Mapear dados para adicionar acao se não existir
        const historicoMapeado = historicoData.map(
          (evento: any, index: number) => {
            let acao = evento.acao || "atualizado";

            // Se é o primeiro evento, provavelmente foi criado
            if (index === historicoData.length - 1 && !evento.acao) {
              acao = "criado";
            }

            // Se o motivo menciona cancelado
            if (evento.motivo?.toLowerCase().includes("cancelado")) {
              acao = "cancelado";
            }

            // Se há alteração de status para vencido
            if (
              evento.alteracoes?.status === "VENCIDO" ||
              evento.alteracoes?.status === "vencido"
            ) {
              acao = "vencido";
            }

            return { ...evento, acao };
          },
        );

        setHistorico(historicoMapeado);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getAcaoIcon = (acao: string) => {
    const acaoLower = acao?.toLowerCase() || "";
    switch (acaoLower) {
      case "criado":
        return <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "atualizado":
        return <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "vencido":
        return (
          <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        );
      case "cancelado":
        return <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return (
          <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        );
    }
  };

  const getAcaoLabel = (acao: string) => {
    const acaoLower = acao?.toLowerCase() || "";
    switch (acaoLower) {
      case "criado":
        return "Contrato Criado";
      case "atualizado":
        return "Contrato Atualizado";
      case "vencido":
        return "Contrato Vencido";
      case "cancelado":
        return "Contrato Cancelado";
      case "renovado":
        return "Contrato Renovado";
      default:
        return acaoLower || "Ação";
    }
  };

  const getAcaoColor = (acao: string) => {
    const acaoLower = acao?.toLowerCase() || "";
    switch (acaoLower) {
      case "criado":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-l-emerald-500";
      case "atualizado":
        return "bg-sky-50 dark:bg-sky-900/20 border-l-4 border-l-[var(--sky-trust)]";
      case "vencido":
        return "bg-orange-50 dark:bg-orange-900/20 border-l-4 border-l-orange-500";
      case "cancelado":
        return "bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-500";
      default:
        return "bg-slate-50 dark:bg-slate-50/10 border-l-4 border-l-slate-400";
    }
  };

  const getAcaoBgColor = (acao: string) => {
    const acaoLower = acao?.toLowerCase() || "";
    switch (acaoLower) {
      case "criado":
        return "bg-emerald-100 dark:bg-emerald-500/20";
      case "atualizado":
        return "bg-sky-100 dark:bg-sky-500/20";
      case "vencido":
        return "bg-orange-100 dark:bg-orange-500/20";
      case "cancelado":
        return "bg-red-100 dark:bg-red-500/20";
      default:
        return "bg-slate-100 dark:bg-slate-500/20";
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderizarAlteracoes = (
    acao: string,
    alteracoes: Record<string, any>,
  ) => {
    const acaoLower = acao?.toLowerCase() || "";
    if (acaoLower === "criado") {
      return (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Este contrato foi criado no sistema
        </span>
      );
    }

    if (acaoLower === "atualizado" && alteracoes.mudancas) {
      const mudancas = Object.entries(alteracoes.mudancas)
        .filter(([_, v]) => v !== undefined)
        .map(([key, value]: [string, any]) => {
          let fieldName = key;
          let oldVal = value.de;
          let newVal = value.para;

          if (key === "titulo") fieldName = "Título";
          if (key === "descricao") fieldName = "Descrição";
          if (key === "dataVencimento") fieldName = "Data de Vencimento";
          if (key === "dataInicio") fieldName = "Data de Início";
          if (key === "valor") {
            fieldName = "Valor";
            oldVal = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(oldVal);
            newVal = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(newVal);
          }
          if (key === "status") fieldName = "Status";
          if (key === "empresa") fieldName = "Empresa";
          if (key === "motorista") fieldName = "Motorista";

          return { fieldName, oldVal, newVal };
        });

      if (mudancas.length === 0) {
        return (
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Contrato atualizado
          </span>
        );
      }

      return (
        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
          {mudancas.map((m, i) => (
            <div
              key={i}
              className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700"
            >
              <p className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                {m.fieldName}
              </p>
              <p className="text-xs space-x-2">
                <span className="line-through text-red-600 dark:text-red-400">
                  {String(m.oldVal).substring(0, 50)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">→</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {String(m.newVal).substring(0, 50)}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (acaoLower === "vencido") {
      return (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Contrato atingiu sua data de vencimento
        </span>
      );
    }

    if (acaoLower === "cancelado") {
      return (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Contrato foi cancelado
        </span>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {isMobile ? <HeaderMobile /> : <Header />}
        <main
          className={`${isMobile ? "px-4 py-4" : "max-w-4xl mx-auto px-6 py-8"}`}
        >
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
          </div>
        </main>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {isMobile ? <HeaderMobile /> : <Header />}
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Contrato não encontrado
            </p>
            <Link href="/contratos">
              <Button variant="outline" className="mt-4">
                Voltar para Contratos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {isMobile ? <HeaderMobile /> : <Header />}

      {/* Main Content */}
      <main
        className={`${isMobile ? "px-4 py-4" : "max-w-4xl mx-auto px-6 py-8"}`}
      >
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Histórico
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {contrato.titulo} • {contrato.empresa}
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {historico.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Sem eventos no histórico
                </p>
              </CardContent>
            </Card>
          ) : (
            historico.map((evento, index) => (
              <Card
                key={evento.id}
                className={`border-0 ${getAcaoColor(evento.acao)} transition-all hover:shadow-md`}
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Icon Circle */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 ${getAcaoBgColor(evento.acao)} flex items-center justify-center flex-shrink-0 border-0 rounded-full`}
                      >
                        {getAcaoIcon(evento.acao)}
                      </div>
                      {index < historico.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                        {getAcaoLabel(evento.acao)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {formatarData(evento.dataAlteracao)}
                      </p>

                      {/* Alterações */}
                      {renderizarAlteracoes(evento.acao, evento.alteracoes)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        {historico.length > 0 && (
          <Card className="mt-8 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-l-[var(--sky-trust)]">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--sky-trust)] dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  O histórico mostra todas as ações realizadas neste contrato,
                  desde sua criação até as últimas atualizações.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
