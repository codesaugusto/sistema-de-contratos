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
  FileText,
  ChevronLeft,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Building2,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { contratosApi } from "@/lib/api";

export default function DetalhesContrato() {
  const isMobile = useIsMobile();
  const params = useParams();
  const id = params.id as string;
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contratosApi
      .buscarPorId(id)
      .then(setContrato)
      .catch(() => setContrato(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {isMobile ? <HeaderMobile /> : <Header />}
        <main className="max-w-4xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {isMobile ? <HeaderMobile /> : <Header />}
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
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

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800";
      case "vencido":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800";
      case "pendente":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case "cancelado":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const diasParaVencer = () => {
    const hoje = new Date();
    const vencimento = new Date(contrato.dataVencimento);
    const diff = Math.ceil(
      (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const dias = diasParaVencer();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {isMobile ? <HeaderMobile /> : <Header />}

      {/* Main Content */}
      <main
        className={`${isMobile ? "px-4 py-4 pb-24" : "max-w-4xl mx-auto px-6 py-8"} space-y-6`}
      >
        {/* Alerta se vencendo */}
        {contrato.status === "ativo" && dias <= 30 && dias > 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Contrato vencendo em {dias} dia{dias === 1 ? "" : "s"}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Renove antes de {formatarData(contrato.dataVencimento)}
              </p>
            </div>
          </div>
        )}

        {contrato.status === "vencido" && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Contrato vencido
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Este contrato expirou em {formatarData(contrato.dataVencimento)}
              </p>
            </div>
          </div>
        )}

        {/* Card Principal */}
        <Card className="bg-white dark:bg-slate-900 border border-[var(--border-default)] rounded-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 truncate">
                {contrato.titulo}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {contrato.descricao}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(contrato.status)}`}
            >
              {getStatusLabel(contrato.status)}
            </span>
          </div>
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[var(--border-default)]">
              <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Empresa
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1 truncate">
                  {contrato.empresa}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[var(--border-default)]">
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Motorista
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1 truncate">
                  {contrato.motorista}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[var(--border-default)]">
              <DollarSign className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Valor
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1">
                  {formatarValor(contrato.valor)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[var(--border-default)]">
              <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Duração
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1">
                  {Math.ceil(
                    (new Date(contrato.dataVencimento).getTime() -
                      new Date(contrato.dataInicio).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  dias
                </p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="border-t border-[var(--border-default)] pt-6 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4 uppercase text-sm tracking-wider">
              Período do Contrato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[var(--border-default)]">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Início
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {formatarData(contrato.dataInicio)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[var(--border-default)]">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Vencimento
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {formatarData(contrato.dataVencimento)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Datas de Criação */}
          <div className="border-t border-[var(--border-default)] pt-6 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p>
              Criado em: {new Date(contrato.criadoEm).toLocaleString("pt-BR")}
            </p>
            <p>
              Última atualização:{" "}
              {new Date(contrato.atualizadoEm).toLocaleString("pt-BR")}
            </p>
          </div>
        </Card>

        {/* Ações */}
        <div className={`flex gap-3 ${isMobile ? "flex-col" : ""}`}>
          <Link href={`/contratos/${contrato.id}/editar`} className="flex-1">
            <Button className="w-full bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer flex items-center justify-center gap-2 font-medium transition-all">
              <Edit2 className="w-4 h-4" />
              Editar Contrato
            </Button>
          </Link>
          <Link href={`/contratos/${contrato.id}/historico`} className="flex-1">
            <Button className="w-full border border-[var(--border-default)] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all font-medium">
              Ver Histórico
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
