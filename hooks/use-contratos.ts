import { useState, useEffect, useCallback } from 'react'

export interface Contrato {
  id: string
  titulo: string
  descricao: string
  dataInicio: string
  dataVencimento: string
  valor: number
  status: 'ativo' | 'vencido' | 'pendente' | 'cancelado'
  empresa: string
  motorista: string
  documentos: string[]
  criadoEm: string
  atualizadoEm: string
}

export interface HistoricoContrato {
  id: string
  contratoId: string
  acao: 'criado' | 'atualizado' | 'vencido' | 'cancelado'
  alteracoes: Record<string, any>
  dataAlteracao: string
}

export function useContratos() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar contratos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('contratos')
    if (stored) {
      try {
        setContratos(JSON.parse(stored))
      } catch (e) {
        console.error('Erro ao carregar contratos:', e)
      }
    }
    setLoading(false)
  }, [])

  // Salvar contratos no localStorage sempre que mudam
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('contratos', JSON.stringify(contratos))
    }
  }, [contratos, loading])

  const adicionarContrato = useCallback((contrato: Omit<Contrato, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const novoContrato: Contrato = {
      ...contrato,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }
    
    setContratos(prev => [...prev, novoContrato])
    addHistorico(novoContrato.id, 'criado', { novo: novoContrato })
    
    return novoContrato
  }, [])

  const atualizarContrato = useCallback((id: string, alteracoes: Partial<Contrato>) => {
    setContratos(prev => 
      prev.map(c => {
        if (c.id === id) {
          const contratoAtualizado = {
            ...c,
            ...alteracoes,
            atualizadoEm: new Date().toISOString(),
          }
          addHistorico(id, 'atualizado', { anterior: c, novo: contratoAtualizado, alteracoes })
          return contratoAtualizado
        }
        return c
      })
    )
  }, [])

  const deletarContrato = useCallback((id: string) => {
    const contrato = contratos.find(c => c.id === id)
    if (contrato) {
      setContratos(prev => prev.filter(c => c.id !== id))
      addHistorico(id, 'cancelado', { removido: contrato })
    }
  }, [contratos])

  const obterContrato = useCallback((id: string) => {
    return contratos.find(c => c.id === id)
  }, [contratos])

  const atualizarStatusAutomatico = useCallback(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    setContratos(prev => 
      prev.map(c => {
        if (c.status === 'ativo' || c.status === 'pendente') {
          const dataVencimento = new Date(c.dataVencimento)
          dataVencimento.setHours(0, 0, 0, 0)

          if (dataVencimento < hoje) {
            return { ...c, status: 'vencido' as const }
          }
        }
        return c
      })
    )
  }, [])

  return {
    contratos,
    loading,
    adicionarContrato,
    atualizarContrato,
    deletarContrato,
    obterContrato,
    atualizarStatusAutomatico,
  }
}

export function useHistoricoContratos() {
  const [historico, setHistorico] = useState<HistoricoContrato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('historico-contratos')
    if (stored) {
      try {
        setHistorico(JSON.parse(stored))
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('historico-contratos', JSON.stringify(historico))
    }
  }, [historico, loading])

  const addHistorico = useCallback((contratoId: string, acao: HistoricoContrato['acao'], alteracoes: Record<string, any>) => {
    const novoHistorico: HistoricoContrato = {
      id: Date.now().toString(),
      contratoId,
      acao,
      alteracoes,
      dataAlteracao: new Date().toISOString(),
    }
    
    setHistorico(prev => [novoHistorico, ...prev])
    return novoHistorico
  }, [])

  const obterHistorico = useCallback((contratoId?: string) => {
    if (contratoId) {
      return historico.filter(h => h.contratoId === contratoId)
    }
    return historico
  }, [historico])

  return {
    historico,
    loading,
    addHistorico,
    obterHistorico,
  }
}

// Exportar a função addHistorico para uso global
let addHistorico: ((contratoId: string, acao: HistoricoContrato['acao'], alteracoes: Record<string, any>) => HistoricoContrato) | null = null

export function initializeHistoricoCallback(callback: typeof addHistorico) {
  addHistorico = callback
}
