"use client";

import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Cookie } from "lucide-react";

export default function PoliticaCookies() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {isMobile ? <HeaderMobile /> : <Header />}

      <main
        className={`${isMobile ? "px-4 py-4" : "max-w-4xl mx-auto px-6 py-8"}`}
      >
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-[var(--border-default)] dark:border-slate-700">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Cookie className="w-6 h-6 text-[var(--sky-trust)] flex-shrink-0 mt-1" />
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-50 text-2xl md:text-3xl">
                  Política de Cookies
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                  Última atualização: 30 de abril de 2026
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 text-slate-700 dark:text-slate-300">
            {/* Aviso de Aceitação Automática */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>✓ Consentimento Automático:</strong> Ao usar
                ContratoApp, você automaticamente concorda com o uso de cookies
                conforme descrito nesta política. O uso contínuo de nossos
                serviços constitui aceitação de nossa Política de Cookies.
              </p>
            </div>

            {/* O que são Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                1. O Que São Cookies?
              </h2>
              <p className="leading-relaxed">
                Cookies são pequenos arquivos de texto armazenados no seu
                navegador que ajudam a plataforma a funcionar melhor. Eles podem
                ser "cookies de sessão" (apagados quando você fecha o navegador)
                ou "cookies persistentes" (que permanecem armazenados).
              </p>
            </section>

            {/* Tipos de Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                2. Tipos de Cookies que Usamos
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    ✅ Cookies Essenciais (Não Requer Consentimento)
                  </h3>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-[var(--sky-trust)] font-bold">
                        •
                      </span>
                      <span>
                        <strong>contratos-auth:</strong> Mantém você autenticado
                        na plataforma (28 dias)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--sky-trust)] font-bold">
                        •
                      </span>
                      <span>
                        <strong>access_token:</strong> Token de acesso para
                        requisições (7 dias)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--sky-trust)] font-bold">
                        •
                      </span>
                      <span>
                        <strong>next-theme:</strong> Preferência de tema
                        (claro/escuro) - persistente
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    📊 Cookies de Funcionalidade (Requer Consentimento)
                  </h3>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-[var(--sky-trust)] font-bold">
                        •
                      </span>
                      <span>
                        <strong>cookie-consent:</strong> Armazena sua escolha
                        sobre aceitar/rejeitar cookies
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* LocalStorage */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                3. LocalStorage (Armazenamento Local)
              </h2>
              <p className="leading-relaxed mb-3">
                Além de cookies, usamos o localStorage (armazenamento local do
                navegador) para:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>@contratos:usuario:</strong> Dados do usuário
                    autenticado
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>contratos:</strong> Lista de contratos em cache
                    local
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>cookie-consent:</strong> Sua preferência de cookies
                  </span>
                </li>
              </ul>
            </section>

            {/* Por Que Usamos */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                4. Por Que Usamos Cookies?
              </h2>
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 mt-3">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-left font-semibold">
                      Propósito
                    </th>
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-left font-semibold">
                      Cookies/Armazenamento
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Autenticação
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      contratos-auth, access_token
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Segurança
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      CSRF protection, validação de sessão
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Preferências
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      next-theme, cookie-consent
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Performance
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Cache de dados locais
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Controle de Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                5. Como Controlar Cookies
              </h2>
              <p className="leading-relaxed mb-3">
                A maioria dos navegadores permite que você controle cookies
                através das configurações:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Chrome:</strong> Configurações → Privacidade e
                    segurança → Cookies e dados de sites
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Firefox:</strong> Preferências → Privacidade →
                    Cookies e dados de site
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Safari:</strong> Preferências → Privacidade →
                    Cookies e dados de site
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Edge:</strong> Configurações → Privacidade, pesquisa
                    e serviços → Cookies
                  </span>
                </li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 p-3 mt-4 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Aviso:</strong> Desabilitar cookies essenciais pode
                  impedir que ContratoApp funcione corretamente.
                </p>
              </div>
            </section>

            {/* Cookies de Terceiros */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                6. Cookies de Terceiros
              </h2>
              <p className="leading-relaxed">
                Atualmente, ContratoApp <strong>não utiliza</strong> cookies de
                terceiros para rastreamento, análises ou publicidade. Todos os
                cookies são de primeira parte (do nosso domínio).
              </p>
            </section>

            {/* Consentimento */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                7. Consentimento e Banner de Cookies
              </h2>
              <p className="leading-relaxed mb-3">
                Na primeira visita, você verá um banner pedindo consentimento
                para cookies. Suas opções:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">✓</span>
                  <span>
                    <strong>Aceitar Cookies:</strong> Todos os cookies serão
                    habilitados
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">✗</span>
                  <span>
                    <strong>Rejeitar:</strong> Apenas cookies essenciais
                    permanecerão ativo
                  </span>
                </li>
              </ul>
            </section>

            {/* Atualizações */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                8. Atualizações desta Política
              </h2>
              <p className="leading-relaxed">
                Podemos atualizar esta Política de Cookies periodicamente.
                Qualquer mudança significativa será notificada através de um
                banner ou email. Sua contínua utilização da plataforma significa
                aceitação das atualizações.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                9. Contato
              </h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <p className="leading-relaxed mb-2">
                  Dúvidas sobre nossa Política de Cookies? Entre em contato:
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  Email: privacidade@contratoapp.com.br
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
