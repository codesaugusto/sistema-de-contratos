"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  authApi,
  type AuthResponse,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

interface Usuario {
  email: string;
  nome: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  isAutenticado: boolean;
  loading: boolean;
  erro: string | null;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Recupera sessão salva ao montar
  useEffect(() => {
    const salvo = authApi.getUsuarioLogado();
    if (salvo) setUsuario(salvo);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthResponse> => {
      setLoading(true);
      setErro(null);
      try {
        const data = await authApi.login(payload);
        setUsuario({ email: data.email, nome: data.nome });
        return data;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Erro ao fazer login";
        setErro(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthResponse> => {
      setLoading(true);
      setErro(null);
      try {
        const data = await authApi.register(payload);
        setUsuario({ email: data.email, nome: data.nome });
        return data;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Erro ao criar conta";
        setErro(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authApi.logout();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAutenticado: !!usuario,
        loading,
        erro,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
