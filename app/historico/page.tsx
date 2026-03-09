'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ChevronLeft, Clock, FileText, Edit3, Plus, Trash2, 
  Search, Filter
} from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'

interface HistoricoContrato {
  id: string
  contratoId: string
  acao: 'criado' | 'atualizado' | 'vencido' | 'cancelado'
  alteracoes: Record<string, any>
  dataAlteracao: string
}

export default function Historico() {
  const [historico, setHistorico] = useState<HistoricoContrato[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedHistorico = localStorage.getItem('historico-contratos')
    const storedContratos = localStorage.getItem('contratos')

    if (storedHistorico) {
      try {
        setHistorico(JSON.parse(storedHistorico))
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }

    if (storedContratos) {
      try {
        setContratos(JSON.parse(storedContratos))
      } catch (e) {
        console.error('Erro ao carregar contratos:', e)
      }
    }

    setLoading(false)
  }, [])

  const getContratoTitulo = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId)
    return contrato?.titulo || 'Contrato deletado'
  }

  const historicofiltrado = historico.filter(h => {
    const contratoTitulo = getContratoTitulo(h.contratoId).toLowerCase()
    return contratoTitulo.includes(filtro.toLowerCase())
  })

  const getAcaoIcon = (acao: string) => {
    switch(acao) {
      case 'criado':
        return <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'atualizado':
        return <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'vencido':
        return <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
      case 'cancelado':
        return <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
      default:
        return <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
    }
  }

  const getAcaoLabel = (acao: string) => {
    switch(acao) {
      case 'criado':
        return 'Contrato Criado'
      case 'atualizado':
        return 'Contrato Atualizado'
      case 'vencido':
        return 'Contrato Vencido'
      case 'cancelado':
        return 'Contrato Cancelado'
      default:
        return acao
    }
  }

  const getAcaoColor = (acao: string) => {
    switch(acao) {
      case 'criado':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
      case 'atualizado':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
      case 'vencido':
        return 'bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700'
      case 'cancelado':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderizarAlteracoes = (acao: string, alteracoes: Record<string, any>) => {
    if (acao === 'criado') {
      return <span className="text-sm text-slate-600 dark:text-slate-400">Novo contrato adicionado ao sistema</span>
    }

    if (acao === 'atualizado' && alteracoes.mudancas) {
      const mudancas = Object.entries(alteracoes.mudancas)
        .filter(([_, v]) => v !== undefined)
        .map(([key, value]: [string, any]) => {
          let fieldName = key
          let oldVal = value.de
          let newVal = value.para

          if (key === 'dataVencimento') fieldName = 'Data de Vencimento'
          if (key === 'valor') {
            oldVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(oldVal)
            newVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newVal)
          }

          return `${fieldName}: ${oldVal} → ${newVal}`
        })

      return (
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          {mudancas.map((m, i) => <div key={i}>{m}</div>)}
        </div>
      )
    }

    if (acao === 'vencido') {
      return <span className="text-sm text-slate-600 dark:text-slate-400">Contrato atingiu data de vencimento</span>
    }

    if (acao === 'cancelado') {
      return <span className="text-sm text-slate-600 dark:text-slate-400">Contrato foi cancelado</span>
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Histórico de Contratos</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtro */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle>Filtrar Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por contrato..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Mostrando {historicofiltrado.length} de {historico.length} evento(s)
            </p>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">Carregando histórico...</p>
              </CardContent>
            </Card>
          ) : historicofiltrado.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">Nenhum evento no histórico</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  {filtro ? 'Tente ajustar o filtro' : 'Os eventos dos seus contratos aparecerão aqui'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {historicofiltrado.map((evento, index) => (
                <Card key={evento.id} className={`border ${getAcaoColor(evento.acao)} transition-colors hover:shadow-md`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                          {getAcaoIcon(evento.acao)}
                        </div>
                        {index < historicofiltrado.length - 1 && (
                          <div className="w-0.5 h-12 bg-slate-300 dark:bg-slate-600"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {getAcaoLabel(evento.acao)}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              <Link
                                href={`/contratos/${evento.contratoId}`}
                                className="hover:underline font-medium"
                              >
                                {getContratoTitulo(evento.contratoId)}
                              </Link>
                            </p>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {formatarData(evento.dataAlteracao)}
                          </div>
                        </div>

                        {/* Alterações */}
                        <div className="mt-3 text-slate-600 dark:text-slate-400">
                          {renderizarAlteracoes(evento.acao, evento.alteracoes)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
