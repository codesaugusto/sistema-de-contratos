'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contract, DashboardStats } from '@/types/contract';
import { contractStorage } from '@/lib/storage/contractStorage';

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar contratos e stats
  const loadContracts = useCallback(() => {
    setIsLoading(true);
    contractStorage.updateStatuses();
    const data = contractStorage.getAll();
    const dashboardStats = contractStorage.getStats();
    setContracts(data);
    setStats(dashboardStats);
    setIsLoading(false);
  }, []);

  // Inicializar
  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  // Criar contrato
  const createContract = useCallback((contract: Omit<Contract, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const newContract = contractStorage.create(contract);
    loadContracts();
    return newContract;
  }, [loadContracts]);

  // Atualizar contrato
  const updateContract = useCallback((id: string, updates: Partial<Omit<Contract, 'id' | 'criadoEm'>>) => {
    const updated = contractStorage.update(id, updates);
    loadContracts();
    return updated;
  }, [loadContracts]);

  // Deletar contrato
  const deleteContract = useCallback((id: string) => {
    const success = contractStorage.delete(id);
    if (success) {
      loadContracts();
    }
    return success;
  }, [loadContracts]);

  return {
    contracts,
    stats,
    isLoading,
    createContract,
    updateContract,
    deleteContract,
    refresh: loadContracts,
  };
}
