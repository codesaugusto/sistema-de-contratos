"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Verificar se já foi aceito (apenas no client)
    const consentAceito = localStorage.getItem("cookie-consent");
    if (!consentAceito) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
  };

  // Evitar renderizar no servidor
  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-50">
      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-slate-700 rounded-lg shadow-2xl w-80 sm:w-96">
        <div className="flex gap-4 p-4 sm:p-6">
          {/* Ícone */}
          <div className="flex-shrink-0">
            <Cookie className="w-6 h-6 text-[var(--sky-trust)]" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-2">
              Política de Cookies e Privacidade
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              Utilizamos cookies e tecnologias similares para melhorar sua
              experiência, autenticação e personalização. Ao continuar usando
              nossos serviços, você concorda automaticamente com nossa{" "}
              <Link
                href="/privacidade"
                className="text-[var(--sky-trust)] hover:text-[var(--sky-trust)]/80 underline"
              >
                Política de Privacidade
              </Link>{" "}
              e{" "}
              <Link
                href="/termos"
                className="text-[var(--sky-trust)] hover:text-[var(--sky-trust)]/80 underline"
              >
                Termos de Serviço
              </Link>
              .
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              <strong>
                Ao usar a plataforma, você automaticamente concorda com todos os
                nossos termos, políticas e diretrizes.
              </strong>
            </p>

            {/* Botões */}
            <div className="flex gap-2 flex-col sm:flex-row">
              <Button
                onClick={handleAccept}
                className="bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white text-xs sm:text-sm font-medium cursor-pointer flex-1"
              >
                Aceitar Cookies
              </Button>
              <Button
                onClick={handleReject}
                className="bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs sm:text-sm font-medium cursor-pointer flex-1 transition-colors"
              >
                Rejeitar
              </Button>
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={handleReject}
            className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
