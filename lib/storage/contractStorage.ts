import { Contract, ContractStatus } from '@/types/contract';

const STORAGE_KEY = 'contracts_data';

export const contractStorage = {
  // Obter todos os contratos
  getAll: (): Contract[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Obter um contrato por ID
  getById: (id: string): Contract | null => {
    const contracts = contractStorage.getAll();
    return contracts.find(c => c.id === id) || null;
  },

  // Criar novo contrato
  create: (contract: Omit<Contract, 'id' | 'criadoEm' | 'atualizadoEm'>): Contract => {
    const contracts = contractStorage.getAll();
    const newContract: Contract = {
      ...contract,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    contracts.push(newContract);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
    return newContract;
  },

  // Atualizar contrato
  update: (id: string, updates: Partial<Omit<Contract, 'id' | 'criadoEm'>>): Contract | null => {
    const contracts = contractStorage.getAll();
    const index = contracts.findIndex(c => c.id === id);
    if (index === -1) return null;

    contracts[index] = {
      ...contracts[index],
      ...updates,
      atualizadoEm: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
    return contracts[index];
  },

  // Deletar contrato
  delete: (id: string): boolean => {
    const contracts = contractStorage.getAll();
    const filtered = contracts.filter(c => c.id !== id);
    if (filtered.length === contracts.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Atualizar status automaticamente baseado em datas
  updateStatuses: (): void => {
    const contracts = contractStorage.getAll();
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    contracts.forEach(contract => {
      const vencimento = new Date(contract.dataVencimento);
      let newStatus: ContractStatus = 'ativo';

      if (vencimento < today) {
        newStatus = 'vencido';
      } else if (vencimento <= in30Days) {
        newStatus = 'expirando';
      }

      if (contract.status !== newStatus) {
        contract.status = newStatus;
        contract.atualizadoEm = new Date().toISOString();
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  },

  // Obter estatísticas
  getStats: () => {
    contractStorage.updateStatuses();
    const contracts = contractStorage.getAll();

    const totalContratos = contracts.length;
    const contratosAtivos = contracts.filter(c => c.status === 'ativo').length;
    const contratosVencidos = contracts.filter(c => c.status === 'vencido').length;
    const contratosExpirando = contracts.filter(c => c.status === 'expirando').length;
    const valorTotal = contracts
      .filter(c => c.status === 'ativo')
      .reduce((sum, c) => sum + c.valor, 0);

    const proximosVencimentos = contracts
      .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
      .slice(0, 5);

    return {
      totalContratos,
      contratosAtivos,
      contratosVencidos,
      contratosExpirando,
      valorTotal,
      proximosVencimentos,
      alertasNaoLidos: contratosExpirando + contratosVencidos,
    };
  },

  // Limpar todos os dados
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
