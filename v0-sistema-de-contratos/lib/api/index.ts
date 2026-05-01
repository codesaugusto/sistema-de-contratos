/**
 * Ponto de entrada único para a camada de API.
 * Importe sempre daqui: import { relatoriosApi, authApi } from "@/lib/api"
 */

export { apiFetch, publicFetch, ApiError } from "./client";
export { authApi } from "./auth";
export { contratosApi } from "./contratos";
export { notificacoesApi } from "./notificacoes";
export { relatoriosApi } from "./relatorios";

export type { AuthResponse, LoginPayload, RegisterPayload } from "./auth";
export type { PageResponse, ListarContratosParams } from "./contratos";
export type { Notificacao } from "./notificacoes";
export type {
  RelatorioDashboard,
  FiltrosRelatorio,
  RelatorioFiltrado,
} from "./relatorios";
