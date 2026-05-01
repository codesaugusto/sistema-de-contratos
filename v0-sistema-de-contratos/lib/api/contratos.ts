import { apiFetch } from "./client";
import type { Contrato, HistoricoContrato } from "@/hooks/use-contratos";

// ── Tipos da resposta paginada do Spring ─────────────────────────────────────

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual (0-based)
  size: number;
}

// ── Parâmetros de listagem ────────────────────────────────────────────────────

export interface ListarContratosParams {
  titulo?: string;
  motorista?: string;
  empresa?: string;
  status?: Contrato["status"];
  page?: number;
  size?: number;
  sort?: string; // ex: "criadoEm,desc"
}

// ── Serviço ───────────────────────────────────────────────────────────────────

export const contratosApi = {
  /**
   * Lista contratos com paginação e filtros opcionais.
   */
  listar: (params: ListarContratosParams = {}) => {
    const query = new URLSearchParams();
    if (params.titulo) query.set("titulo", params.titulo);
    if (params.motorista) query.set("motorista", params.motorista);
    if (params.empresa) query.set("empresa", params.empresa);
    if (params.status) query.set("status", params.status.toUpperCase());
    if (params.page != null) query.set("page", String(params.page));
    if (params.size != null) query.set("size", String(params.size));
    if (params.sort) query.set("sort", params.sort);

    return apiFetch<PageResponse<Contrato>>(`/contratos?${query.toString()}`);
  },

  /**
   * Busca um contrato pelo ID.
   */
  buscarPorId: (id: string) => apiFetch<Contrato>(`/contratos/${id}`),

  /**
   * Cria um novo contrato.
   */
  criar: (
    data: Omit<
      Contrato,
      "id" | "criadoEm" | "atualizadoEm" | "documentos" | "dataCriacao"
    >,
  ) =>
    apiFetch<Contrato>("/contratos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Atualiza um contrato existente.
   */
  atualizar: (id: string, data: Partial<Omit<Contrato, "id" | "criadoEm">>) =>
    apiFetch<Contrato>(`/contratos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),


  /**
   * Deleta um contrato permanentemente.
   */
  deletar: (id: string) =>
    apiFetch<void>(`/contratos/${id}`, { method: "DELETE" }),

  /**
   * Retorna o histórico de alterações de um contrato.
   */
  historico: (id: string) =>
    apiFetch<HistoricoContrato[]>(`/contratos/${id}/historico`),
};