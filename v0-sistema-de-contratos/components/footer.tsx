"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export function Footer() {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Placeholder vazio para evitar SSR mismatch */}
        </div>
      </footer>
    );
  }
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 sm:mt-16">
      <div
        className={`${isMobile ? "px-4 py-6" : "max-w-7xl mx-auto px-6 py-8"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sobre */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3 text-sm">
              Sobre
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              ContratoApp é uma plataforma moderna para gerenciamento de
              contratos de motoristas de ônibus.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3 text-sm">
              Produto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/contratos"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  Contratos
                </Link>
              </li>
              <li>
                <Link
                  href="/relatorios"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  Relatórios
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3 text-sm">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacidade"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3 text-sm">
              Suporte
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:suporte@contratoapp.com.br"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  suporte@contratoapp.com.br
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacidade@contratoapp.com.br"
                  className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--sky-trust)] dark:hover:text-[var(--sky-trust)] transition-colors"
                >
                  privacidade@contratoapp.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
            <p className="text-slate-600 dark:text-slate-400">
              © 2026 ContratoApp. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Desenvolvido com <span className="text-red-500">♥</span> para
              motoristas de ônibus
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
