'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, AlertCircle, Clock, Check, Trash2, 
  CheckAll, Calendar
} from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'

interface Notificacao {
  id: string
  contratoId: string
  tipo: 'vencimento' | 'renovacao' | 'aviso'
  titulo: string
  descricao: string
  dataVencimento: string
  diasRestantes: number
  lida: boolean
  dataCriacao: string
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [filtro, setFiltro] = useState<'todos' | 'nao-lidas' | 'lidas'>('nao-lidas')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedContratos = localStorage.getItem('contratos')
    if (storedContratos) {
      try {
        const contractList = JSON.parse(storedContratos) as Contrato[]
        setContratos(contractList)
        gerarNotificacoes(contractList)
      } catch (e) {
        console.error('Erro ao carregar contratos:', e)
      }
    }
    setLoading(false)
  }, [])

  const gerarNotificacoes = (contractList: Contrato[]) => {
    const notifs: Notificacao[] = []
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    contractList.forEach(contrato => {
      if (contrato.status === 'ativo' || contrato.status === 'pendente') {
        const dataVencimento = new Date(contrato.dataVencimento)
        dataVencimento.setHours(0, 0, 0, 0)
        const diasRestantes = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

        if (diasRestantes <= 0) {
          notifs.push({
            id: `vencido-${contrato.id}`,
            contratoId: contrato.id,
            tipo: 'vencimento',
            titulo: 'Contrato Vencido',
            descricao: `O contrato "${contrato.titulo}" venceu e precisa ser renovado urgentemente.`,
            dataVencimento: contrato.dataVencimento,
            diasRestantes: diasRestantes,
            lida: false,
            dataCriacao: new Date().toISOString(),
          })
        } else if (diasRestantes <= 7) {
          notifs.push({
            id: `critico-${contrato.id}`,
            contratoId: contrato.id,
            tipo: 'vencimento',
            titulo: 'Contrato Vencendo em Breve',
            descricao: `O contrato "${contrato.titulo}" vencerá em ${diasRestantes} dia${diasRestantes === 1 ? '' : 's'}. Renove antes que expire.`,
            dataVencimento: contrato.dataVencimento,
            diasRestantes: diasRestantes,
            lida: false,
            dataCriacao: new Date().toISOString(),
          })
        } else if (diasRestantes <= 30) {
          notifs.push({
            id: `aviso-${contrato.id}`,
            contratoId: contrato.id,
            tipo: 'aviso',
            titulo: 'Lembrete de Vencimento',
            descricao: `O contrato "${contrato.titulo}" vencerá em ${diasRestantes} dias. Comece a preparar a renovação.`,
            dataVencimento: contrato.dataVencimento,
            diasRestantes: diasRestantes,
            lida: false,
            dataCriacao: new Date().toISOString(),
          })
        }
      }
    })

    setNotificacoes(notifs)
  }

  const toggleLido = (id: string) => {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: !n.lida } : n)
    )
  }

  const deletarNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id))
  }

  const marcarTudasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }

  const notificacoesFiltradas = notificacoes.filter(n => {
    if (filtro === 'nao-lidas') return !n.lida
    if (filtro === 'lidas') return n.lida
    return true
  })

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'vencimento':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
      case 'renovacao':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
      case 'aviso':
        return 'bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700'
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'vencimento':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'renovacao':
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'aviso':
        return <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const naoLidas = notificacoes.filter(n => !n.lida).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notificações</h1>
            {naoLidas > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {naoLidas} notificação{naoLidas === 1 ? '' : 's'} não lida{naoLidas === 1 ? '' : 's'}
              </p>
            )}
          </div>
          {naoLidas > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={marcarTudasComoLidas}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <CheckAll className="w-4 h-4 mr-1" />
              Marcar tudo
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={filtro === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltro('todos')}
          >
            Todas
          </Button>
          <Button
            variant={filtro === 'nao-lidas' ? 'default' : 'outline'}
            onClick={() => setFiltro('nao-lidas')}
          >
            Não Lidas
          </Button>
          <Button
            variant={filtro === 'lidas' ? 'default' : 'outline'}
            onClick={() => setFiltro('lidas')}
          >
            Lidas
          </Button>
        </div>

        {/* Notificações */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">Carregando notificações...</p>
              </CardContent>
            </Card>
          ) : notificacoesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">Nenhuma notificação</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  {filtro === 'nao-lidas' ? 'Você está em dia com todas as notificações!' : 'Nenhuma notificação para exibir'}
                </p>
              </CardContent>
            </Card>
          ) : (
            notificacoesFiltradas.map(notif => (
              <Card 
                key={notif.id}
                className={`border transition-all ${getTipoColor(notif.tipo)} ${notif.lida ? 'opacity-75' : 'opacity-100'}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="pt-1">
                      {getTipoIcon(notif.tipo)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {notif.titulo}
                            {notif.lida && (
                              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {notif.descricao}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                            Vencimento: <span className="font-medium">{formatarData(notif.dataVencimento)}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-col items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLido(notif.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900"
                      >
                        {notif.lida ? 'Marcar não lida' : 'Marcar lida'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletarNotificacao(notif.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Link href={`/contratos/${notif.contratoId}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
