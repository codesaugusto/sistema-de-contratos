import { useState, useEffect, useCallback } from "react";
import {
  relatoriosApi,
  type RelatorioDashboard,
  type FiltrosRelatorio,
  type RelatorioFiltrado,
} from "@/lib/api/relatorios";
import { ApiError } from "@/lib/api/client";

/**
 * Hook para consumir dados de relatórios
 *
 * @example
 * const { stats, loading, error } = useRelatorios();
 *
 * @example
 * const { contratos, total, loading, pagina, irParaPagina } = useRelatorios("contratos", {
 *   status: "ATIVO",
 *   size: 20
 * });
 */

interface UseRelatoriosOptions {
  autoLoad?: boolean; // carregar dados automaticamente ao montar
}

interface UseRelatorioDashboardReturn {
  stats: RelatorioDashboard | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseRelatorioContratosReturn {
  contratos: any[];
  total: number;
  totalPaginas: number;
  paginaAtual: number;
  loading: boolean;
  error: string | null;
  irParaPagina: (page: number) => Promise<void>;
  refetch: (novosFiltros?: FiltrosRelatorio) => Promise<void>;
}

// ── Versão 1: Hook para Dashboard ──────────────────────────────────────

export function useRelatorioDashboard(
  options: UseRelatoriosOptions = { autoLoad: true },
): UseRelatorioDashboardReturn {
  const [stats, setStats] = useState<RelatorioDashboard | null>(null);
  const [loading, setLoading] = useState(options.autoLoad ?? true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await relatoriosApi.getDashboard();
      setStats(data);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Erro ${err.status}: ${err.message}`
          : err instanceof Error
            ? err.message
            : "Erro desconhecido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoLoad ?? true) {
      fetch();
    }
  }, [fetch, options.autoLoad]);

  return {
    stats,
    loading,
    error,
    refetch: fetch,
  };
}

// ── Versão 2: Hook para Contratos com Paginação ─────────────────────────

export function useRelatorioContratos(
  filtrosIniciais: FiltrosRelatorio = { page: 0, size: 10 },
  options: UseRelatoriosOptions = { autoLoad: true },
): UseRelatorioContratosReturn {
  const [filtros, setFiltros] = useState<FiltrosRelatorio>(filtrosIniciais);
  const [data, setData] = useState<RelatorioFiltrado | null>(null);
  const [loading, setLoading] = useState(options.autoLoad ?? true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (novosFiltros?: FiltrosRelatorio) => {
      const filtrosFinal = novosFiltros || filtros;
      try {
        setLoading(true);
        setError(null);
        const result = await relatoriosApi.getContratos(filtrosFinal);
        setData(result);
        setFiltros(filtrosFinal);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `Erro ${err.status}: ${err.message}`
            : err instanceof Error
              ? err.message
              : "Erro desconhecido";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [filtros],
  );

  const irParaPagina = useCallback(
    async (page: number) => {
      await fetch({ ...filtros, page });
    },
    [fetch, filtros],
  );

  useEffect(() => {
    if (options.autoLoad ?? true) {
      fetch();
    }
  }, []); // só na primeira renderização

  return {
    contratos: data?.data || [],
    total: data?.total || 0,
    totalPaginas: data?.totalPaginas || 0,
    paginaAtual: data?.pagina || 0,
    loading,
    error,
    irParaPagina,
    refetch: fetch,
  };
}

// ── Versão 3: Hook para um status específico ──────────────────────────────

export function useRelatorioStatus(
  status: "ATIVO" | "VENCIDO" | "PENDENTE" | "CANCELADO" | "RENOVADO",
): UseRelatorioContratosReturn {
  return useRelatorioContratos(
    { status, size: 1000, page: 0 },
    { autoLoad: true },
  );
}

// ── Versão 4: Hook para múltiplas chamadas (Composição) ───────────────────

interface UseRelatorioCompletoReturn extends UseRelatorioDashboardReturn {
  contratos: any[];
  loading: boolean;
}

/**
 * Hook que combina dashboard + contratos ativos
 * Útil para carregar tudo de uma vez
 */
export function useRelatorioCompleto(): UseRelatorioCompletoReturn {
  const {
    stats,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useRelatorioDashboard();
  const {
    contratos,
    loading: contratosLoading,
    error: contratosError,
    refetch: refetchContratos,
  } = useRelatorioContratos({
    status: "ATIVO",
    size: 50,
  });

  const loading = dashboardLoading || contratosLoading;
  const error = dashboardError || contratosError;

  const refetch = async () => {
    await Promise.all([refetchDashboard(), refetchContratos()]);
  };

  return {
    stats,
    contratos,
    loading,
    error,
    refetch,
  };
}
