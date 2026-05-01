"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ContractCardProps {
  contract: {
    id: string;
    titulo: string;
    empresa: string;
    valor: number;
    dataVencimento: string;
    status: string;
  };
}

export function ContractCard({ contract }: ContractCardProps) {
  const initials = contract.empresa
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getStatusColor = (status: string): string => {
    const statusColorMap: Record<string, string> = {
      ativo:
        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
      vencido: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
      pendente:
        "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
      finalizado:
        "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    };
    return (
      statusColorMap[status] ||
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
    );
  };

  const statusColor = getStatusColor(contract.status);

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <Link href={`/contratos/${contract.id}`}>
      <Card className="border-0 bg-slate-50 border-l-4 border-l-[var(--sky-trust)] dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                {initials}
              </span>
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {contract.titulo}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {contract.empresa}
              </p>
            </div>

            {/* Status Badge */}
            <Badge
              className={`text-xs flex-shrink-0 capitalize ${statusColor}`}
            >
              {contract.status}
            </Badge>
          </div>

          {/* Bottom Info */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Valor
              </p>
              <p className="text-sm font-bold text-black dark:text-white mt-1">
                {formatarValor(contract.valor)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Vencimento
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-300 mt-1">
                {new Date(contract.dataVencimento).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
