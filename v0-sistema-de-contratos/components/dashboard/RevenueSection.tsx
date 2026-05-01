"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardStats } from "@/types/contract";

interface RevenueSectionProps {
  stats: DashboardStats | null;
  contracts: any[];
}

export function RevenueSection({ stats, contracts }: RevenueSectionProps) {
  // Agrupar receitas por empresa
  const revenueByCompany = contracts.reduce(
    (acc: Record<string, number>, contract) => {
      const company = contract.empresa;
      acc[company] = (acc[company] || 0) + contract.valor;
      return acc;
    },
    {},
  );

  const companyData = Object.entries(revenueByCompany).map(([name, valor]) => ({
    name,
    valor: valor as number,
  }));

  // Status dos contratos para gráfico de pizza
  const statusData = [
    {
      name: "Ativos",
      value: stats?.contratosAtivos || 0,
      color: "#10b981",
    },
    {
      name: "Expirando",
      value: stats?.contratosExpirando || 0,
      color: "#f59e0b",
    },
    {
      name: "Vencidos",
      value: stats?.contratosVencidos || 0,
      color: "#ef4444",
    },
  ];

  const totalAtivoValue = stats?.contratosAtivos || 0;

  return (
    <div className="space-y-6">
      {/* Receita Total */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-50/30">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Receita Total (Contratos Ativos)
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              R${" "}
              {(stats?.valorTotal || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAtivoValue} contrato(s) ativo(s)
            </p>
          </div>
        </div>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita por Empresa */}
        {companyData.length > 0 && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600">
            <h3 className="font-semibold mb-4 text-blue-900 dark:text-blue-50">
              Receita por Empresa
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  }
                />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Status dos Contratos */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600">
          <h3 className="font-semibold mb-4 text-blue-900 dark:text-blue-50">
            Distribuição de Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-50"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Resumo de Receitas por Empresa */}
      {companyData.length > 0 && (
        <Card className="p-6 mb-8 md:mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600">
          <h3 className="font-semibold mb-4 text-blue-900 dark:text-blue-50">
            Resumo de Receitas
          </h3>
          <div className="space-y-3">
            {companyData.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contracts.filter((c) => c.empresa === company.name).length}{" "}
                    contrato(s)
                  </p>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  R${" "}
                  {company.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
