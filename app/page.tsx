'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, FileText, Clock, Bell, TrendingUp, Plus, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalContratos: 0,
    contratosAtivos: 0,
    proximosVencimentos: 0,
    pendentes: 0,
    valorTotal: 0
  })
  const [contratos, setContratos] = useState<any[]>([])
  const [revenueByCompany, setRevenueByCompany] = useState<any[]>([])

  useEffect(() => {
    // Carregar estatísticas do localStorage
    const contratosData = JSON.parse(localStorage.getItem('contratos') || '[]')
    const hoje = new Date()
    
    const contratosAtivos = contratosData.filter((c: any) => c.status === 'ativo').length
    const proximosVencimentos = contratosData.filter((c: any) => {
      const dataVencimento = new Date(c.dataVencimento)
      const diasAte = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      return diasAte <= 30 && diasAte > 0 && c.status === 'ativo'
    }).length

    // Calcular valor total de contratos ativos
    const valorTotal = contratosData
      .filter((c: any) => c.status === 'ativo')
      .reduce((sum: number, c: any) => sum + (c.valor || 0), 0)

    // Agrupar receitas por empresa
    const receitas: Record<string, number> = {}
    contratosData.forEach((c: any) => {
      if (c.status === 'ativo') {
        receitas[c.empresa] = (receitas[c.empresa] || 0) + (c.valor || 0)
      }
    })

    const revenueData = Object.entries(receitas).map(([name, valor]) => ({
      name,
      valor: valor as number
    }))

    setStats({
      totalContratos: contratosData.length,
      contratosAtivos,
      proximosVencimentos,
      pendentes: contratosData.filter((c: any) => c.status === 'pendente').length,
      valorTotal
    })
    setContratos(contratosData)
    setRevenueByCompany(revenueData)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ContratoBus</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gerenciador de Contratos</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/contratos">
              <Button variant="ghost">Contratos</Button>
            </Link>
            <Link href="/historico">
              <Button variant="ghost">Histórico</Button>
            </Link>
            <Link href="/relatorios">
              <Button variant="ghost">Relatórios</Button>
            </Link>
            <Link href="/notificacoes">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {stats.proximosVencimentos > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Total de Contratos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalContratos}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Todos os contratos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Contratos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.contratosAtivos}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Em vigência no momento</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-orange-200 dark:border-orange-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Próximos Vencimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.proximosVencimentos}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nos próximos 30 dias</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contratos ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Receitas */}
        {contratos.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">Análise de Receitas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Receita por Empresa */}
              {revenueByCompany.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5 text-blue-600" />
                      Receita por Empresa
                    </CardTitle>
                    <CardDescription>
                      Distribuição de receitas entre empresas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueByCompany}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) =>
                            `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          }
                        />
                        <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Status dos Contratos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                    Distribuição de Status
                  </CardTitle>
                  <CardDescription>
                    Contratos por status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Ativos', value: stats.contratosAtivos, color: '#10b981' },
                          { name: 'Expirando', value: stats.proximosVencimentos, color: '#f59e0b' },
                          { name: 'Pendentes', value: stats.pendentes, color: '#8b5cf6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <span>Ativos: {stats.contratosAtivos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>Expirando: {stats.proximosVencimentos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                      <span>Pendentes: {stats.pendentes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo de Receitas */}
            {revenueByCompany.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Resumo de Receitas por Empresa</CardTitle>
                  <CardDescription>
                    Detalhamento das receitas de cada empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {revenueByCompany.map((company, index) => {
                      const contractCount = contratos.filter(
                        (c: any) => c.empresa === company.name && c.status === 'ativo'
                      ).length
                      return (
                        <div key={index} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{company.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {contractCount} contrato{contractCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-green-600">
                            R$ {company.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Quick Actions */}
        {stats.totalContratos === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo ao ContratoBus</CardTitle>
                  <CardDescription>
                    Gerenciador de contratos inteligente para motoristas de ônibus
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Organize todos os seus contratos em um único lugar. Receba notificações automáticas de vencimentos, 
                    acompanhe o histórico de alterações e gere relatórios detalhados.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">Cadastrar Contrato</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Adicione novos contratos</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">Acompanhar Status</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Monitore vencimentos</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">Gerar Relatórios</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Análise completa</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">Alertas Automáticos</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Nunca perca prazos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
                <CardHeader>
                  <CardTitle>Começar Agora</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-100 mb-4">
                    Crie seu primeiro contrato e comece a gerenciar melhor.
                  </p>
                  <Link href="/contratos/novo" className="w-full block">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Contrato
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Próximas Ações</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                  <p>Nenhum contrato ainda. Crie um novo para começar.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
