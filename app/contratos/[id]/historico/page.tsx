'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, Clock, FileText, Edit3, Plus, Trash2, AlertCircle
} from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'

interface HistoricoContrato {
  id: string
  contratoId: string
  acao: 'criado' | 'atualizado' | 'vencido' | 'cancelado'
  alteracoes: Record<string, any>
  dataAlteracao: string
}

export default function HistoricoContrato() {
  const params = useParams()
  const id = params.id as string

  const [contrato, setContrato] = useState<Contrato | null>(null)
  const [historico, setHistorico] = useState<HistoricoContrato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedContratos = localStorage.getItem('contratos')
    const storedHistorico = localStorage.getItem('historico-contratos')

    if (storedContratos) {
      try {
        const contratos = JSON.parse(storedContratos) as Contrato[]
        const encontrado = contratos.find(c => c.id === id)
        setContrato(encontrado || null)
      } catch (e) {
        console.error('Erro ao carregar contrato:', e)
      }
    }

    if (storedHistorico) {
      try {
        const allHistorico = JSON.parse(storedHistorico) as HistoricoContrato[]
        const filtered = allHistorico.filter(h => h.contratoId === id)
        setHistorico(filtered)
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }

    setLoading(false)
  }, [id])

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
      return <span className="text-sm text-slate-600 dark:text-slate-400">Este contrato foi criado no sistema</span>
    }

    if (acao === 'atualizado' && alteracoes.mudancas) {
      const mudancas = Object.entries(alteracoes.mudancas)
        .filter(([_, v]) => v !== undefined)
        .map(([key, value]: [string, any]) => {
          let fieldName = key
          let oldVal = value.de
          let newVal = value.para

          if (key === 'titulo') fieldName = 'Título'
          if (key === 'descricao') fieldName = 'Descrição'
          if (key === 'dataVencimento') fieldName = 'Data de Vencimento'
          if (key === 'dataInicio') fieldName = 'Data de Início'
          if (key === 'valor') {
            fieldName = 'Valor'
            oldVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(oldVal)
            newVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newVal)
          }
          if (key === 'status') fieldName = 'Status'
          if (key === 'empresa') fieldName = 'Empresa'
          if (key === 'motorista') fieldName = 'Motorista'

          return { fieldName, oldVal, newVal }
        })

      if (mudancas.length === 0) {
        return <span className="text-sm text-slate-600 dark:text-slate-400">Contrato atualizado</span>
      }

      return (
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {mudancas.map((m, i) => (
            <div key={i} className="bg-white dark:bg-slate-700 p-2 rounded">
              <p className="font-medium text-slate-900 dark:text-white">{m.fieldName}</p>
              <p className="text-xs">
                <span className="line-through text-red-600 dark:text-red-400">{m.oldVal}</span>
                {' → '}
                <span className="text-green-600 dark:text-green-400 font-medium">{m.newVal}</span>
              </p>
            </div>
          ))}
        </div>
      )
    }

    if (acao === 'vencido') {
      return <span className="text-sm text-slate-600 dark:text-slate-400">Contrato atingiu sua data de vencimento</span>
    }

    if (acao === 'cancelado') {
      return <span className="text-sm text-slate-600 dark:text-slate-400">Contrato foi cancelado</span>
    }

    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
        <div className="flex items-center justify-center h-screen">
          <p className="text-slate-500 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">Contrato não encontrado</p>
            <Link href="/contratos">
              <Button variant="outline" className="mt-4">
                Voltar para Contratos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/contratos/${id}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span>Detalhes</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">Histórico</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Subtítulo */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{contrato.titulo}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{contrato.empresa}</p>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {historico.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">Sem eventos no histórico</p>
              </CardContent>
            </Card>
          ) : (
            historico.map((evento, index) => (
              <Card key={evento.id} className={`border ${getAcaoColor(evento.acao)} transition-colors hover:shadow-md`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                        {getAcaoIcon(evento.acao)}
                      </div>
                      {index < historico.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-300 dark:bg-slate-600"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {getAcaoLabel(evento.acao)}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {formatarData(evento.dataAlteracao)}
                        </div>
                      </div>

                      {/* Alterações */}
                      {renderizarAlteracoes(evento.acao, evento.alteracoes)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        {historico.length > 0 && (
          <Card className="mt-8 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  O histórico mostra todas as ações realizadas neste contrato, desde sua criação até as últimas atualizações.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
