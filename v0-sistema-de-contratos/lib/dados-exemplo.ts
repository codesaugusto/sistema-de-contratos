// Dados de exemplo para testes e demonstração
// Cole o conteúdo abaixo no localStorage para popular a aplicação com dados

import type { Contrato } from '@/hooks/use-contratos'

export const contratoExemplos: Contrato[] = [
  {
    id: '1',
    titulo: 'Contrato Rota 101 - São Paulo',
    descricao: 'Contrato de trabalho para motorista de ônibus urbano na rota 101 da região oeste',
    dataInicio: '2024-01-15',
    dataVencimento: '2025-03-15',
    valor: 3500.00,
    status: 'ativo',
    empresa: 'Transporte São Paulo LTDA',
    motorista: 'João Silva',
    documentos: [],
    criadoEm: '2024-01-15T08:00:00Z',
    atualizadoEm: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    titulo: 'Contrato Rota 215 - SP Centro',
    descricao: 'Contrato para operação da rota 215 no centro de São Paulo',
    dataInicio: '2023-06-01',
    dataVencimento: '2025-02-01',
    valor: 3800.00,
    status: 'ativo',
    empresa: 'EMTU São Paulo',
    motorista: 'Maria Santos',
    documentos: [],
    criadoEm: '2023-06-01T10:30:00Z',
    atualizadoEm: '2024-12-20T14:20:00Z',
  },
  {
    id: '3',
    titulo: 'Contrato Viação ABC',
    descricao: 'Contrato para rota intermunicipal São Paulo - Campinas',
    dataInicio: '2024-03-20',
    dataVencimento: '2024-09-20',
    valor: 4200.00,
    status: 'vencido',
    empresa: 'Viação ABC Transportes',
    motorista: 'Carlos Costa',
    documentos: [],
    criadoEm: '2024-03-20T09:15:00Z',
    atualizadoEm: '2024-09-20T15:45:00Z',
  },
  {
    id: '4',
    titulo: 'Contrato Rota 305 - Zona Leste',
    descricao: 'Contrato para operação de ônibus urbano zona leste de São Paulo',
    dataInicio: '2024-10-01',
    dataVencimento: '2025-09-30',
    valor: 3650.00,
    status: 'pendente',
    empresa: 'Mobilidade Urbana LTDA',
    motorista: 'Pedro Oliveira',
    documentos: [],
    criadoEm: '2024-10-01T11:00:00Z',
    atualizadoEm: '2024-10-01T11:00:00Z',
  },
  {
    id: '5',
    titulo: 'Contrato Rota 120 - Zona Sul',
    descricao: 'Contrato para rota 120 região zona sul',
    dataInicio: '2023-12-01',
    dataVencimento: '2024-08-01',
    valor: 3500.00,
    status: 'cancelado',
    empresa: 'Transportes Paulista',
    motorista: 'João Silva',
    documentos: [],
    criadoEm: '2023-12-01T08:30:00Z',
    atualizadoEm: '2024-07-15T16:00:00Z',
  },
  {
    id: '6',
    titulo: 'Contrato Rota 402 - Norte',
    descricao: 'Contrato para ônibus articulado zona norte',
    dataInicio: '2024-08-15',
    dataVencimento: '2025-08-14',
    valor: 4100.00,
    status: 'ativo',
    empresa: 'Norte Transportes',
    motorista: 'Roberto Dias',
    documentos: [],
    criadoEm: '2024-08-15T07:45:00Z',
    atualizadoEm: '2024-08-15T07:45:00Z',
  },
]

export const historicoExemplo = [
  {
    id: '100',
    contratoId: '1',
    acao: 'criado' as const,
    alteracoes: {
      novo: contratoExemplos[0],
    },
    dataAlteracao: '2024-01-15T08:00:00Z',
  },
  {
    id: '101',
    contratoId: '2',
    acao: 'criado' as const,
    alteracoes: {
      novo: contratoExemplos[1],
    },
    dataAlteracao: '2023-06-01T10:30:00Z',
  },
  {
    id: '102',
    contratoId: '2',
    acao: 'atualizado' as const,
    alteracoes: {
      mudancas: {
        valor: { de: 3500, para: 3800 },
        dataVencimento: { de: '2024-12-01', para: '2025-02-01' },
      },
    },
    dataAlteracao: '2024-12-20T14:20:00Z',
  },
  {
    id: '103',
    contratoId: '3',
    acao: 'criado' as const,
    alteracoes: {
      novo: contratoExemplos[2],
    },
    dataAlteracao: '2024-03-20T09:15:00Z',
  },
  {
    id: '104',
    contratoId: '3',
    acao: 'vencido' as const,
    alteracoes: {},
    dataAlteracao: '2024-09-20T15:45:00Z',
  },
]

// Função para popular localStorage com dados de exemplo
export function preencherDadosExemplo() {
  // Não sobrescreve dados existentes
  if (!localStorage.getItem('contratos')) {
    localStorage.setItem('contratos', JSON.stringify(contratoExemplos))
  }

  if (!localStorage.getItem('historico-contratos')) {
    localStorage.setItem('historico-contratos', JSON.stringify(historicoExemplo))
  }
}

// Função para limpar todos os dados
export function limparDados() {
  localStorage.removeItem('contratos')
  localStorage.removeItem('historico-contratos')
}
