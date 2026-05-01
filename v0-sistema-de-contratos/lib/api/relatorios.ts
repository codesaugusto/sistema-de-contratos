import { apiFetch } from "./client";
import type { Contrato } from "@/hooks/use-contratos";

// ── Tipos de resposta ─────────────────────────────────────────────────────

export interface RelatorioDashboard {
  totalContratos: number;
  contratosAtivos: number;
  contratosVencidos: number;
  contratosExpirando: number;
  valorTotal: number;
  proximosVencimentos: Contrato[];
  alertasNaoLidos: number;
}

export interface RelatorioFiltrado {
  data: Contrato[];
  total: number;
  pagina: number;
  tamanho: number;
  totalPaginas: number;
}

// ── Parâmetros para filtrar ──────────────────────────────────────────────

export interface FiltrosRelatorio {
  titulo?: string;
  motorista?: string;
  empresa?: string;
  status?: "ATIVO" | "VENCIDO" | "PENDENTE" | "CANCELADO" | "RENOVADO";
  page?: number;
  size?: number;
  sort?: string; // ex: "criadoEm,desc"
}

// ── Serviço de Relatórios ────────────────────────────────────────────────

export const relatoriosApi = {
  /**
   * Obtém o dashboard com estatísticas gerais:
   * - Total de contratos
   * - Contatos ativos/vencidos/expirando
   * - Valor total
   * - Próximos vencimentos
   * - Alertas não lidos
   */
  getDashboard: () => apiFetch<RelatorioDashboard>("/contratos/dashboard"),

  /**
   * Obtém contratos com filtros e paginação para montar relatórios personalizados
   *
   * @param filtros - Objeto com filtros opcionais
   * @returns Contratos filtrados com informações de paginação
   *
   * @example
   * // Listar todos os contratos ativos
   * relatoriosApi.getContratos({ status: "ATIVO" })
   *
   * @example
   * // Filtrar por empresa e motorista
   * relatoriosApi.getContratos({
   *   empresa: "Transportadora XYZ",
   *   motorista: "João",
   *   page: 0,
   *   size: 20
   * })
   *
   * @example
   * // Obter contratos vencidos ordenados por data
   * relatoriosApi.getContratos({
   *   status: "VENCIDO",
   *   sort: "dataVencimento,desc"
   * })
   */
  getContratos: async (
    filtros: FiltrosRelatorio = {},
  ): Promise<RelatorioFiltrado> => {
    const query = new URLSearchParams();

    // Adiciona os filtros à query string
    if (filtros.titulo) query.set("titulo", filtros.titulo);
    if (filtros.motorista) query.set("motorista", filtros.motorista);
    if (filtros.empresa) query.set("empresa", filtros.empresa);
    if (filtros.status) query.set("status", filtros.status);
    if (filtros.page != null) query.set("page", String(filtros.page));
    if (filtros.size != null) query.set("size", String(filtros.size));
    if (filtros.sort) query.set("sort", filtros.sort);

    // Faz a requisição
    const response = await apiFetch<any>(`/contratos?${query.toString()}`);

    // Mapeia a resposta do Spring (Page) para o formato esperado
    return {
      data: response.content || [],
      total: response.totalElements || 0,
      pagina: response.number || 0,
      tamanho: response.size || 10,
      totalPaginas: response.totalPages || 0,
    };
  },

  /**
   * Alias conveniente: obtém apenas contratos ativos
   */
  getAtivos: () => relatoriosApi.getContratos({ status: "ATIVO", size: 1000 }),

  /**
   * Alias conveniente: obtém apenas contratos vencidos
   */
  getVencidos: () =>
    relatoriosApi.getContratos({ status: "VENCIDO", size: 1000 }),

  /**
   * Alias conveniente: obtém apenas contratos pendentes
   */
  getPendentes: () =>
    relatoriosApi.getContratos({ status: "PENDENTE", size: 1000 }),

  /**
   * Obtém o histórico de alterações de um contrato específico
   */
  getHistorico: (contratoId: string) =>
    apiFetch<any[]>(`/contratos/${contratoId}/historico`),
};
