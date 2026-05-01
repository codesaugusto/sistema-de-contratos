/**
 * Cliente HTTP centralizado.
 * - Injeta o JWT via header Authorization em requisições protegidas.
 * - Token armazenado em localStorage (@contratos:token).
 * - Redireciona para /login se o token expirar (401).
 * - Lança erro com a mensagem retornada pelo Spring (ApiError.mensagens).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("@contratos:token");
}

/**
 * Cliente HTTP para rotas PÚBLICAS (sem autenticação obrigatória)
 * Usado para: login, registro, etc.
 */
export async function publicFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Sem conteúdo (DELETE, PATCH sem body)
  if (response.status === 204) {
    return undefined as T;
  }

  // Erro do servidor — extrai a mensagem do padrão ApiError do Spring
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg: string =
      body?.mensagens?.[0] ?? body?.message ?? "Erro na requisição";
    throw new ApiError(response.status, msg);
  }

  return response.json();
}

/**
 * Cliente HTTP para rotas PROTEGIDAS (com autenticação)
 * Envia token JWT via header Authorization
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  if (!token) {
    throw new ApiError(401, "Token não encontrado. Faça login novamente.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers ?? {}),
  };

  const url = `${API_URL}${path}`;
  const method = options.method || "GET";

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Token expirado ou inválido
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("@contratos:token");
      localStorage.removeItem("@contratos:usuario");
      // Limpar os cookies
      document.cookie = "contratos-auth=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "access_token=; path=/; max-age=0; SameSite=Strict";
      window.location.href = "/login";
    }
    throw new ApiError(401, "Sessão expirada. Faça login novamente.");
  }

  // Sem conteúdo (DELETE, PATCH sem body)
  if (response.status === 204) {
    return undefined as T;
  }

  // Erro do servidor — extrai a mensagem do padrão ApiError do Spring
  if (!response.ok) {
    // Clona a resposta para poder ler múltiplas vezes
    const responseClone = response.clone();
    let body: any = {};
    try {
      body = await response.json();
    } catch (e) {
      // Se não conseguir fazer parse como JSON, tenta como texto na cópia
      const text = await responseClone.text();
      body = { rawText: text };
    }

    const msg: string =
      body?.mensagens?.[0] ?? body?.message ?? "Erro na requisição";

    throw new ApiError(response.status, msg);
  }

  return response.json() as Promise<T>;
}
