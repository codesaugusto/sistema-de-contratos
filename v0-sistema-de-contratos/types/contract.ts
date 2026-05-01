export type ContractStatus = 'ativo' | 'vencido' | 'expirando';

export interface Contract {
  id: string;
  motorista: string;
  empresa: string;
  dataInicio: string; // ISO date
  dataVencimento: string; // ISO date
  valor: number;
  status: ContractStatus;
  descricao: string;
  anexos: string[]; // base64 or file paths
  criadoEm: string; // ISO date
  atualizadoEm: string; // ISO date
}

export interface ContractHistory {
  id: string;
  contractId: string;
  versao: number;
  alteracoes: Record<string, unknown>; // delta das mudanças
  dataAlteracao: string; // ISO date
  motivo: string;
}

export interface Notification {
  id: string;
  contractId: string;
  tipo: 'vencimento' | 'aviso' | 'renovacao';
  mensagem: string;
  lida: boolean;
  dataNotificacao: string; // ISO date
  diasAntecedencia: number;
}

export interface DashboardStats {
  totalContratos: number;
  contratosAtivos: number;
  contratosVencidos: number;
  contratosExpirando: number;
  valorTotal: number;
  proximosVencimentos: Contract[];
  alertasNaoLidos: number;
}
