import { apiFetch } from "./client";

export interface Notificacao {
  id: string;
  contratoId: string;
  tituloContrato: string;
  tipo: "VENCIMENTO" | "AVISO" | "RENOVACAO";
  mensagem: string;
  lida: boolean;
  dataNotificacao: string; // ISO
  diasAntecedencia: number | null;
}

export const notificacoesApi = {
  /**
   * Lista todas as notificações (lidas e não lidas).
   */
  listar: () => apiFetch<Notificacao[]>("/notificacoes"),

  /**
   * Lista apenas as notificações não lidas.
   */
  listarNaoLidas: () => apiFetch<Notificacao[]>("/notificacoes/nao-lidas"),

  /**
   * Marca uma notificação como lida.
   */
  marcarComoLida: (id: string) =>
    apiFetch<void>(`/notificacoes/${id}/lida`, { method: "PATCH" }),

  /**
   * Marca uma notificação como não lida.
   */
  marcarComoNaoLida: (id: string) =>
    apiFetch<void>(`/notificacoes/${id}/nao-lida`, { method: "PATCH" }),

  /**
   * Marca todas as notificações como lidas.
   */
  marcarTodasComoLidas: () =>
    apiFetch<void>("/notificacoes/marcar-todas-lidas", { method: "PATCH" }),
};
