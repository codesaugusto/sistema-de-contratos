export interface Contrato {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataVencimento: string;
  valor: number;
  status:
    | "ativo"
    | "vencido"
    | "pendente"
    | "cancelado"
    | "renovado"
    | "expirando";
  empresa: string;
  motorista: string;
  anexos: string[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface HistoricoContrato {
  id: string;
  contratoId: string;
  versao: number;
  alteracoes: Record<string, string>;
  dataAlteracao: string;
  motivo: string;
}
