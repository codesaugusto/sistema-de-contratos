"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

interface Contrato {
  id: string;
  titulo: string;
  empresa: string;
  motorista: string;
  valor: number;
  dataVencimento: string;
  status: string;
}

interface MobileContractosProps {
  contratos: Contrato[];
  onDelete: (id: string) => void;
}

export function MobileContratos({
  contratos,
  onDelete,
}: MobileContractosProps) {
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");

  const contratosFiltrados = contratos.filter((c) => {
    const matchText =
      c.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      c.empresa.toLowerCase().includes(filtro.toLowerCase());

    const matchStatus = statusFiltro === "" || c.status === statusFiltro;

    return matchText && matchStatus;
  });

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
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl pl-1 font-bold text-slate-900 dark:text-white">
            Contratos
          </h1>
        </div>
      </div>
      {/* ========== VALOR EM VIGOR CARD ========== */}
      <div className="px-4 mb-6">
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
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
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
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["", "ativo", "pendente", "vencido"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFiltro(status)}
              className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                statusFiltro === status
                  ? "!bg-[var(--sky-trust)] dark:!bg-[var(--sky-trust-dark)] text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
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
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por título ou empresa..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 bg-slate-100 dark:bg-slate-800 border-0"
          />
        </div>
      </div>

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
          contratosFiltrados.map((contrato) => (
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
          ))
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
