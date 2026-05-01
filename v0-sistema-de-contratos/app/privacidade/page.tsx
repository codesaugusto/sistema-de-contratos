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
import { ChevronLeft, Shield } from "lucide-react";

export default function PoliticaPrivacidade() {
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
              <Shield className="w-6 h-6 text-[var(--sky-trust)] flex-shrink-0 mt-1" />
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-50 text-2xl md:text-3xl">
                  Política de Privacidade
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                  Última atualização: 30 de abril de 2026
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 text-slate-700 dark:text-slate-300">
            {/* Introdução */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                1. Introdução
              </h2>
              <p className="leading-relaxed">
                A <strong>ContratoApp</strong> ("nós", "nosso" ou "Aplicação") é
                comprometida com a proteção de seus dados pessoais e com o
                cumprimento das leis aplicáveis, especialmente a Lei Geral de
                Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
              </p>
              <p className="leading-relaxed mt-3">
                Esta Política de Privacidade descreve como coletamos, usamos,
                compartilhamos e protegemos suas informações quando você utiliza
                nossa aplicação.{" "}
                <strong>
                  Ao usar ContratoApp, você automaticamente concorda com esta
                  política.
                </strong>
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>✓ Consentimento Automático:</strong> O uso contínuo de
                  nossos serviços constitui aceitação desta Política de
                  Privacidade e dos Termos de Serviço.
                </p>
              </div>
            </section>

            {/* Dados Coletados */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                2. Dados Pessoais que Coletamos
              </h2>
              <p className="leading-relaxed mb-3">
                Coletamos os seguintes tipos de dados pessoais:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Dados de Autenticação:</strong> Email, senha
                    (criptografada), nome completo
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Dados de Contratos:</strong> Título, descrição,
                    datas, valores, empresa, motorista
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Dados de Atividade:</strong> Histórico de
                    alterações, timestamps, IP de acesso
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Dados de Cookies:</strong> Preferências de tema,
                    estado de autenticação
                  </span>
                </li>
              </ul>
            </section>

            {/* Base Legal */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                3. Base Legal para Processamento (LGPD Art. 7º)
              </h2>
              <p className="leading-relaxed mb-3">
                Processamos seus dados com base em:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Consentimento:</strong> Através de seu aceite ao
                    fazer login
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Cumprimento de Contrato:</strong> Para executar o
                    serviço contratado
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Obrigação Legal:</strong> Conforme requerido por lei
                  </span>
                </li>
              </ul>
            </section>

            {/* Uso de Dados */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                4. Como Usamos Seus Dados
              </h2>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Fornecer acesso à aplicação e seus recursos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Manter histórico e auditoria de alterações</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Melhorar segurança e prevenir fraudes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Conformidade com obrigações legais</span>
                </li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                5. Compartilhamento de Dados
              </h2>
              <p className="leading-relaxed">
                <strong>Não compartilhamos</strong> seus dados pessoais com
                terceiros, exceto:
              </p>
              <ul className="space-y-2 ml-4 mt-3">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Quando obrigado por lei ou ordem judicial</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    Provedores de infraestrutura (hospedagem, backup) sob
                    contratos de confidencialidade
                  </span>
                </li>
              </ul>
            </section>

            {/* Segurança */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                6. Segurança de Dados
              </h2>
              <p className="leading-relaxed mb-3">
                Implementamos medidas de segurança para proteger seus dados:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Criptografia SSL/TLS em todas as comunicações</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Senhas armazenadas com hash (não em texto plano)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Backup automático diário</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Acesso restrito a dados sensíveis</span>
                </li>
              </ul>
            </section>

            {/* Retenção de Dados */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                7. Retenção de Dados
              </h2>
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 mt-3">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-left font-semibold">
                      Tipo de Dado
                    </th>
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-left font-semibold">
                      Período de Retenção
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Dados de Usuário Ativo
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Enquanto conta estiver ativa
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Histórico de Contratos
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      24 meses após conclusão
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Logs de Auditoria
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      12 meses
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Cookies de Sessão
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3">
                      Até logout ou 30 dias de inatividade
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Direitos do Usuário */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                8. Seus Direitos (LGPD Art. 18)
              </h2>
              <p className="leading-relaxed mb-3">Você tem direito a:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Confirmação e Acesso:</strong> Confirmar se
                    processamos seus dados e acessá-los
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Portabilidade:</strong> Exportar seus dados em
                    formato estruturado (disponível no perfil)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Correção:</strong> Atualizar dados incorretos
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Exclusão (Direito ao Esquecimento):</strong>{" "}
                    Solicitar exclusão de seus dados
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Revogação de Consentimento:</strong> Retirar seu
                    consentimento a qualquer momento
                  </span>
                </li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                9. Cookies e Tecnologias Similares
              </h2>
              <p className="leading-relaxed mb-3">Usamos cookies para:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Autenticação:</strong> Manter você conectado
                    (consentimento necessário)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>Preferências:</strong> Lembrar tema (claro/escuro) -
                    não necessita consentimento
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    <strong>LocalStorage:</strong> Dados como histórico local
                    (navegador)
                  </span>
                </li>
              </ul>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                10. Contato - Encarregado de Dados (DPO)
              </h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <p className="leading-relaxed mb-2">
                  Para exercer seus direitos ou reportar problemas de
                  privacidade:
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  Email: privacidade@contratoapp.com.br
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Responderemos em até 10 dias úteis, conforme exigido pela
                  LGPD.
                </p>
              </div>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                11. Alterações nesta Política
              </h2>
              <p className="leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente.
                Notificaremos você de mudanças significativas por email ou
                através de aviso em nossa aplicação. O uso contínuo representa
                sua aceitação das mudanças.
              </p>
            </section>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Esta Política de Privacidade está em conformidade com a Lei
                Geral de Proteção de Dados Pessoais (LGPD) e demais leis de
                proteção de dados aplicáveis.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
