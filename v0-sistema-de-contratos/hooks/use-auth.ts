"use client";

import { useState, useCallback, useEffect } from "react";
import { authApi, type LoginPayload } from "@/lib/api";

interface Usuario {
  email: string;
  nome: string;
}

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Recupera sessão salva ao montar
  useEffect(() => {
    const salvo = authApi.getUsuarioLogado();
    if (salvo) setUsuario(salvo);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setErro(null);
    try {
      const data = await authApi.login(payload);
      setUsuario({ email: data.email, nome: data.nome });
      return data;
    } catch (e: any) {
      setErro(e.message ?? "Erro ao fazer login");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUsuario(null);
  }, []);

  return {
    usuario,
    isAutenticado: !!usuario,
    loading,
    erro,
    login,
    logout,
  };
}
