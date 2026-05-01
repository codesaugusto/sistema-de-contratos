import { apiFetch, publicFetch } from "./client";

export interface AuthResponse {
  token: string;
  tipo: string;
  email: string;
  nome: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  email: string;
  nome: string;
  senha: string;
}

/** Expiração do cookie de sessão: 7 dias em segundos */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const authApi = {
  /**
   * Autentica o usuário e persiste dados do usuário no localStorage.
   * Token é automaticamente gerenciado pelo navegador via cookie httpOnly.
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const data = await publicFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Persiste token e dados do usuário
    localStorage.setItem("@contratos:token", data.token);
    localStorage.setItem(
      "@contratos:usuario",
      JSON.stringify({ email: data.email, nome: data.nome }),
    );

    // Cookie "contratos-auth" para o middleware de proteção de rotas
    document.cookie = `contratos-auth=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    return data;
  },

  /**
   * Registra um novo usuário e o autentica automaticamente.
   * Token é automaticamente gerenciado pelo navegador via cookie httpOnly.
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const data = await publicFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Persiste token e dados do usuário
    localStorage.setItem("@contratos:token", data.token);
    localStorage.setItem(
      "@contratos:usuario",
      JSON.stringify({ email: data.email, nome: data.nome }),
    );

    // Cookie "contratos-auth" para o middleware de proteção de rotas
    document.cookie = `contratos-auth=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    return data;
  },

  /**
   * Remove dados do usuário, limpa cookies e redireciona para /login.
   */
  logout: (): void => {
    localStorage.removeItem("@contratos:token");
    localStorage.removeItem("@contratos:usuario");
    // Expira ambos os cookies (contratos-auth e access_token)
    document.cookie = "contratos-auth=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Strict";
    window.location.href = "/login";
  },

  /**
   * Retorna os dados do usuário logado (lidos do localStorage).
   */
  getUsuarioLogado: (): { email: string; nome: string } | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("@contratos:usuario");
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Verifica se há um usuário logado (verifica localStorage e cookie).
   */
  isAutenticado: (): boolean => {
    if (typeof window === "undefined") return false;
    // Verifica se há dados de usuário salvos
    return !!localStorage.getItem("@contratos:usuario");
  },
};
