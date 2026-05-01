"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bell, AlertCircle, Clock, CheckCircle, Trash2 } from "lucide-react";
import type { Notificacao } from "@/lib/api/notificacoes";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";

interface MobileNotificacoesProps {
  notificacoes: Notificacao[];
  filtro: "todos" | "nao-lidas" | "lidas";
  onFiltro: (filtro: "todos" | "nao-lidas" | "lidas") => void;
  onMarcarLido: (id: string, lidoAtual: boolean) => void;
  onDeletar: (id: string) => void;
  onMarcarTudasComoLidas: () => void;
  calcularDiasAntecedencia?: (contratoId: string) => number | null;
}

export function MobileNotificacoes({
  notificacoes,
  filtro,
  onFiltro,
  onMarcarLido,
  onDeletar,
  onMarcarTudasComoLidas,
  calcularDiasAntecedencia,
}: MobileNotificacoesProps) {
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const notificacoesFiltradas = notificacoes.filter((n) => {
    if (filtro === "nao-lidas") return !n.lida;
    if (filtro === "lidas") return n.lida;
    return true;
  });

  const formatarData = (data: string) => {
    try {
      const date = new Date(data);
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  const getIcone = (tipo: string) => {
    switch (tipo?.toUpperCase()) {
      case "VENCIMENTO":
        return (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      case "AVISO":
        return (
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      default:
        return <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl pl-1 font-bold text-slate-900 dark:text-white">
            Notificações
          </h1>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onFiltro("nao-lidas")}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              filtro === "nao-lidas"
                ? "!bg-[var(--sky-trust)] dark:!bg-[var(--sky-trust-dark)] text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Não Lidas {naoLidas > 0 && `(${naoLidas})`}
          </button>
          <button
            onClick={() => onFiltro("todos")}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              filtro === "todos"
                ? "!bg-[var(--sky-trust)] dark:!bg-[var(--sky-trust-dark)] text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => onFiltro("lidas")}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              filtro === "lidas"
                ? "!bg-[var(--sky-trust)] dark:!bg-[var(--sky-trust-dark)] text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Lidas
          </button>
        </div>
      </div>

      {/* Mark All as Read */}
      {naoLidas > 0 && (
        <div className="px-4 mb-4">
          <Button
            onClick={onMarcarTudasComoLidas}
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 border-0"
            variant="outline"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar tudo como lido
          </Button>
        </div>
      )}

      {/* Notificações */}
      <div className="px-4 space-y-3 flex flex-col gap-2 pb-32">
        {notificacoesFiltradas.length === 0 ? (
          <Empty className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 my-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell className="w-6 h-6 text-slate-400" />
              </EmptyMedia>
              <EmptyTitle>Nenhuma notificação</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          notificacoesFiltradas.map((notif) => (
            <Card
              key={notif.id}
              className={`border-0 overflow-hidden border-l-4 ${
                notif.lida
                  ? "border-l-slate-300 dark:border-l-slate-600 bg-slate-50/50 dark:bg-slate-900/30 opacity-60"
                  : (() => {
                      const dias =
                        notif.diasAntecedencia ??
                        calcularDiasAntecedencia?.(notif.contratoId);
                      return dias !== null && dias <= 0
                        ? "border-l-red-500 bg-slate-50 dark:bg-slate-900/50"
                        : dias !== null && dias <= 7
                          ? "border-l-orange-500 bg-slate-50 dark:bg-slate-900/50"
                          : "border-l-yellow-500 bg-slate-50 dark:bg-slate-900/50";
                    })()
              } shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Ícone */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcone(notif.tipo)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">
                        {notif.tituloContrato}
                      </h3>
                      {!notif.lida && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {notif.mensagem}
                    </p>

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        {formatarData(notif.dataNotificacao)}
                      </span>
                      {(notif.diasAntecedencia ??
                        calcularDiasAntecedencia?.(notif.contratoId)) !==
                      null ? (
                        <Badge
                          className={`text-xs ${(() => {
                            const dias =
                              notif.diasAntecedencia ??
                              calcularDiasAntecedencia?.(notif.contratoId) ??
                              0;
                            return dias <= 0
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : dias <= 7
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
                          })()}`}
                        >
                          {notif.diasAntecedencia ??
                            calcularDiasAntecedencia?.(notif.contratoId)}{" "}
                          dias
                        </Badge>
                      ) : null}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Link
                        href={`/contratos/${notif.contratoId}`}
                        className="flex-1"
                      >
                        <Button size="sm" variant="outline" className="w-full">
                          Ver Contrato
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeletar(notif.id)}
                        className="px-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {!notif.lida && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onMarcarLido(notif.id, notif.lida)}
                          className="px-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
