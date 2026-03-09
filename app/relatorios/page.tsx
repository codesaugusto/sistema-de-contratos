'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, Download, Filter, TrendingUp, Clock, 
  FileText, AlertCircle, CheckCircle
} from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

export default function Relatorios() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)

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

  // Estatísticas
  const stats = {
    total: contratos.length,
    ativos: contratos.filter(c => c.status === 'ativo').length,
    vencidos: contratos.filter(c => c.status === 'vencido').length,
    pendentes: contratos.filter(c => c.status === 'pendente').length,
    cancelados: contratos.filter(c => c.status === 'cancelado').length,
    valorTotal: contratos.reduce((acc, c) => acc + c.valor, 0),
    valorAtivos: contratos.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valor, 0),
  }

  // Dados para gráficos
  const dataStatus = [
    { name: 'Ativos', value: stats.ativos, color: '#10b981' },
    { name: 'Vencidos', value: stats.vencidos, color: '#ef4444' },
    { name: 'Pendentes', value: stats.pendentes, color: '#f59e0b' },
    { name: 'Cancelados', value: stats.cancelados, color: '#6b7280' },
  ].filter(d => d.value > 0)

  // Contratos por empresa
  const empresas = [...new Set(contratos.map(c => c.empresa))]
  const dataEmpresa = empresas.map(empresa => ({
    empresa: empresa.substring(0, 10),
    total: contratos.filter(c => c.empresa === empresa).length,
    ativos: contratos.filter(c => c.empresa === empresa && c.status === 'ativo').length,
    vencidos: contratos.filter(c => c.empresa === empresa && c.status === 'vencido').length,
  }))

  // Valor por status
  const dataValor = [
    { status: 'Ativos', valor: stats.valorAtivos },
    { status: 'Vencidos', valor: contratos.filter(c => c.status === 'vencido').reduce((acc, c) => acc + c.valor, 0) },
    { status: 'Pendentes', valor: contratos.filter(c => c.status === 'pendente').reduce((acc, c) => acc + c.valor, 0) },
  ].filter(d => d.valor > 0)

  // Contratos próximos de vencer
  const hoje = new Date()
  const proximosVencimentos = contratos
    .filter(c => c.status === 'ativo')
    .map(c => {
      const dataVencimento = new Date(c.dataVencimento)
      const diasRestantes = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      return { contrato: c, diasRestantes }
    })
    .filter(c => c.diasRestantes > 0 && c.diasRestantes <= 60)
    .sort((a, b) => a.diasRestantes - b.diasRestantes)

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const exportarRelatorio = () => {
    const relatorio = {
      geradoEm: new Date().toLocaleString('pt-BR'),
      resumo: stats,
      contratos: contratos,
    }

    const dataStr = JSON.stringify(relatorio, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-contratos-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
        <div className="flex items-center justify-center h-screen">
          <p className="text-slate-500 dark:text-slate-400">Carregando relatórios...</p>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Relatórios</h1>
          <Button 
            onClick={exportarRelatorio}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Resumo Executivo */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Resumo Executivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total de Contratos</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ativos</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.ativos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Vencidos</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.vencidos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Valor Total</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatarValor(stats.valorTotal)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status dos Contratos */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>
                Proporção de contratos por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dataStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>

          {/* Valor por Status */}
          <Card>
            <CardHeader>
              <CardTitle>Valor por Status</CardTitle>
              <CardDescription>
                Valor total de contratos em cada status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataValor.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataValor}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatarValor(value)} />
                    <Bar dataKey="valor" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contratos por Empresa */}
        {dataEmpresa.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Contratos por Empresa</CardTitle>
              <CardDescription>
                Número de contratos em cada empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataEmpresa}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="empresa" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total" />
                  <Bar dataKey="ativos" fill="#10b981" name="Ativos" />
                  <Bar dataKey="vencidos" fill="#ef4444" name="Vencidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Próximos Vencimentos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
            <CardDescription>
              Contratos vencendo nos próximos 60 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {proximosVencimentos.length > 0 ? (
              <div className="space-y-3">
                {proximosVencimentos.slice(0, 5).map(item => (
                  <div key={item.contrato.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {item.contrato.titulo}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.contrato.empresa}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {item.diasRestantes}d
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatarValor(item.contrato.valor)}
                      </p>
                    </div>
                  </div>
                ))}
                {proximosVencimentos.length > 5 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                    +{proximosVencimentos.length - 5} contrato(s) adicional(is)
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                Nenhum contrato vencendo nos próximos 60 dias
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
