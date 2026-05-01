/**
 * TODO: MOVER PARA BACKEND POR SEGURANÇA
 *
 * Esta função verifica e renova automaticamente contratos vencidos.
 * IMPORTANTE: Isso deveria ser implementado no backend (Cron Job ou Webhook)
 * porque:
 * 1. Maior segurança - usuário não consegue contornar a lógica
 * 2. Executa mesmo se o navegador do usuário fechar
 * 3. Pode ser auditado e logado de forma segura
 * 4. Ocorre em tempo determinístico (não depende de quando o usuário acessa)
 *
 * Implementação sugerida:
 * - Usar um Cron Job que roda diariamente
 * - Ou um Webhook/evento que dispara quando a data de vencimento chega
 * - Com logging completo de todas as renovações automáticas
 */

import type { Contrato } from "@/hooks/use-contratos";

export interface ContratoRenovado extends Contrato {
  dataRenovacao: string;
  statusAnterior: string;
}

/**
 * Verifica contratos vencidos e os renova automaticamente
 * TODO: Mover essa lógica para o backend
 */
export function verificarERenovarContratosVencidos(): {
  renovados: ContratoRenovado[];
  quantidadeRenovada: number;
} {
  try {
    const contratos = JSON.parse(
      localStorage.getItem("contratos") || "[]",
    ) as Contrato[];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const renovados: ContratoRenovado[] = [];

    // Verificar cada contrato ativo
    const contratosAtualizados = contratos.map((contrato) => {
      if (contrato.status === "ativo") {
        const dataVencimento = new Date(contrato.dataVencimento);
        dataVencimento.setHours(0, 0, 0, 0);

        // Se a data de vencimento já passou, renovar automaticamente
        if (dataVencimento < hoje) {
          const statusAnterior = contrato.status;

          // Renovar: criar novo contrato com datas atualizadas
          const diasVencidos = Math.floor(
            (hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24),
          );

          // Calcular nova data de vencimento (1 ano a partir de hoje)
          const novaDataVencimento = new Date(hoje);
          novaDataVencimento.setFullYear(novaDataVencimento.getFullYear() + 1);

          const contratoRenovado: ContratoRenovado = {
            ...contrato,
            dataInicio: hoje.toISOString().split("T")[0],
            dataVencimento: novaDataVencimento.toISOString().split("T")[0],
            atualizadoEm: new Date().toISOString(),
            statusAnterior,
            dataRenovacao: new Date().toISOString(),
          };

          renovados.push(contratoRenovado);

          // Registrar no histórico
          const historico = JSON.parse(
            localStorage.getItem("historico-contratos") || "[]",
          );
          historico.unshift({
            id: Date.now().toString(),
            contratoId: contrato.id,
            acao: "renovado_automaticamente",
            alteracoes: {
              anterior: {
                dataVencimento: contrato.dataVencimento,
                status: statusAnterior,
              },
              novo: {
                dataVencimento: contratoRenovado.dataVencimento,
                status: contrato.status,
              },
              diasVencidos,
            },
            dataAlteracao: new Date().toISOString(),
            motivo: "Renovação automática de contrato vencido",
          });
          localStorage.setItem(
            "historico-contratos",
            JSON.stringify(historico),
          );

          return contratoRenovado;
        }
      }

      return contrato;
    });

    // Salvar contratos atualizados
    if (renovados.length > 0) {
      localStorage.setItem("contratos", JSON.stringify(contratosAtualizados));
    }

    return {
      renovados,
      quantidadeRenovada: renovados.length,
    };
  } catch (erro) {
    return {
      renovados: [],
      quantidadeRenovada: 0,
    };
  }
}

/**
 * Função auxiliar para formatação de logs
 */
export function logRenovacaoAutomatica(
  resultado: ReturnType<typeof verificarERenovarContratosVencidos>,
): void {
  if (resultado.quantidadeRenovada > 0) {
    // Contratos renovados automaticamente
  }
}
