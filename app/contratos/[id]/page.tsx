'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, ChevronLeft, Edit2, Trash2, Calendar, DollarSign, 
  Building2, User, Clock, AlertCircle 
} from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'

export default function DetalhesContrato() {
  const params = useParams()
  const id = params.id as string
  const [contrato, setContrato] = useState<Contrato | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('contratos')
    if (stored) {
      const contratos = JSON.parse(stored) as Contrato[]
      const encontrado = contratos.find(c => c.id === id)
      setContrato(encontrado || null)
    }
    setLoading(false)
  }, [id])

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
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
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

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ativo':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'vencido':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      case 'pendente':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'cancelado':
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'ativo':
        return 'Ativo'
      case 'vencido':
        return 'Vencido'
      case 'pendente':
        return 'Pendente'
      case 'cancelado':
        return 'Cancelado'
      default:
        return status
    }
  }

  const diasParaVencer = () => {
    const hoje = new Date()
    const vencimento = new Date(contrato.dataVencimento)
    const diff = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const dias = diasParaVencer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/contratos" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span>Contratos</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{contrato.titulo}</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Alerta se vencendo */}
        {contrato.status === 'ativo' && dias <= 30 && dias > 0 && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Contrato vencendo em {dias} dia{dias === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Renove antes de {formatarData(contrato.dataVencimento)}
              </p>
            </div>
          </div>
        )}

        {contrato.status === 'vencido' && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Contrato vencido
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Este contrato expirou em {formatarData(contrato.dataVencimento)}
              </p>
            </div>
          </div>
        )}

        {/* Card Principal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl">{contrato.titulo}</CardTitle>
              <CardDescription className="mt-2">{contrato.descricao}</CardDescription>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(contrato.status)}`}>
              {getStatusLabel(contrato.status)}
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Empresa</p>
                  <p className="font-medium text-slate-900 dark:text-white">{contrato.empresa}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Motorista</p>
                  <p className="font-medium text-slate-900 dark:text-white">{contrato.motorista}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Valor</p>
                  <p className="font-medium text-slate-900 dark:text-white">{formatarValor(contrato.valor)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Duração</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {Math.ceil((new Date(contrato.dataVencimento).getTime() - new Date(contrato.dataInicio).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </p>
                </div>
              </div>
            </div>

            {/* Datas */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Período do Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Início</p>
                    <p className="font-medium text-slate-900 dark:text-white">{formatarData(contrato.dataInicio)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Vencimento</p>
                    <p className="font-medium text-slate-900 dark:text-white">{formatarData(contrato.dataVencimento)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Datas de Criação */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>Criado em: {new Date(contrato.criadoEm).toLocaleString('pt-BR')}</p>
              <p>Última atualização: {new Date(contrato.atualizadoEm).toLocaleString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-3">
          <Link href={`/contratos/${contrato.id}/editar`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Edit2 className="w-4 h-4 mr-2" />
              Editar Contrato
            </Button>
          </Link>
          <Link href={`/contratos/${contrato.id}/historico`} className="flex-1">
            <Button variant="outline" className="w-full">
              Ver Histórico
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
