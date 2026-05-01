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
import { ChevronLeft, FileText } from "lucide-react";

export default function Termos() {
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
              <FileText className="w-6 h-6 text-[var(--sky-trust)] flex-shrink-0 mt-1" />
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-50 text-2xl md:text-3xl">
                  Termos de Serviço
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                  Última atualização: 30 de abril de 2026
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 text-slate-700 dark:text-slate-300">
            {/* Aceitação */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                1. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed mb-3">
                Ao acessar e usar a plataforma ContratoApp, você concorda em
                estar vinculado por estes Termos de Serviço.{" "}
                <strong>
                  O simples ato de usar nossos serviços constitui aceitação
                  automática de todos estes termos, bem como de nossa Política
                  de Privacidade e Política de Cookies.
                </strong>
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>⚠️ Importante:</strong> Ao continuar usando
                  ContratoApp após ler este aviso, você automaticamente concorda
                  com todos os nossos termos, políticas e diretrizes. Se não
                  concorda com qualquer parte, por favor, descontinue o uso de
                  nosso serviço.
                </p>
              </div>
            </section>

            {/* Descrição do Serviço */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                2. Descrição do Serviço
              </h2>
              <p className="leading-relaxed mb-3">
                ContratoApp é uma plataforma de gerenciamento de contratos que
                permite que motoristas de ônibus visualizem, organizem e
                gerenciem seus contratos de trabalho. O serviço inclui:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Gerenciamento centralizado de contratos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Rastreamento de datas de vencimento</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Relatórios e análises</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Notificações automáticas</span>
                </li>
              </ul>
            </section>

            {/* Elegibilidade */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                3. Elegibilidade
              </h2>
              <p className="leading-relaxed">
                Para usar ContratoApp, você deve ter no mínimo 18 anos de idade.
                Você é responsável por manter a confidencialidade de suas
                credenciais de acesso e por todas as atividades que ocorrem sob
                sua conta.
              </p>
            </section>

            {/* Responsabilidades do Usuário */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                4. Responsabilidades do Usuário
              </h2>
              <p className="leading-relaxed mb-3">Você concorda em:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Fornecer informações precisas e atualizadas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Não compartilhar suas credenciais com terceiros</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Usar o serviço apenas para fins legítimos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Não tentar acessar sistemas não autorizados</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Não transmitir malware ou código malicioso</span>
                </li>
              </ul>
            </section>

            {/* Licença de Uso */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                5. Licença de Uso
              </h2>
              <p className="leading-relaxed">
                Concedemos a você uma licença pessoal, não-exclusiva, revogável
                e intransferível para usar ContratoApp. Você não pode: (a)
                reproduzir, (b) distribuir, (c) modificar, (d) fazer engenharia
                reversa, ou (e) descompilar qualquer parte do serviço.
              </p>
            </section>

            {/* Propriedade Intelectual */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                6. Propriedade Intelectual
              </h2>
              <p className="leading-relaxed">
                Todo conteúdo, recursos e funcionalidades do ContratoApp
                (incluindo design, gráficos, texto) são propriedade de
                ContratoApp ou de seus provedores de conteúdo e são protegidos
                por leis internacionais de propriedade intelectual.
              </p>
            </section>

            {/* Limitações de Responsabilidade */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                7. Limitações de Responsabilidade
              </h2>
              <p className="leading-relaxed mb-3">
                ContratoApp é fornecido "no estado em que se encontra". Não
                fazemos garantias, expressas ou implícitas, sobre:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Precisão ou completude do conteúdo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Disponibilidade contínua do serviço</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>Ausência de erros ou bugs</span>
                </li>
              </ul>
            </section>

            {/* Indenização */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                8. Indenização
              </h2>
              <p className="leading-relaxed">
                Você concorda em indenizar, defender e responsabilizar
                ContratoApp, seus funcionários e agentes de qualquer reclamação,
                dano, perda ou despesa (incluindo honorários advocatícios)
                relacionados ao seu uso do serviço ou violação destes termos.
              </p>
            </section>

            {/* Rescisão */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                9. Rescisão
              </h2>
              <p className="leading-relaxed mb-3">
                ContratoApp pode rescindir ou suspender sua conta imediatamente,
                sem aviso prévio, se você violar qualquer termo deste acordo.
                Após rescisão:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    Seu direito de usar ContratoApp cessa imediatamente
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    Seus dados serão retidos conforme Política de Privacidade
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--sky-trust)] font-bold">•</span>
                  <span>
                    Você pode solicitar exportação de dados em até 30 dias
                  </span>
                </li>
              </ul>
            </section>

            {/* Modificações */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                10. Modificações nos Termos
              </h2>
              <p className="leading-relaxed">
                ContratoApp pode modificar estes termos a qualquer momento.
                Notificaremos você sobre mudanças significativas. O uso
                continuado do serviço após as modificações constitui aceitação
                dos termos revisados.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                11. Contato
              </h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <p className="leading-relaxed mb-2">
                  Se tiver dúvidas sobre estes Termos de Serviço, entre em
                  contato:
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  Email: suporte@contratoapp.com.br
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
