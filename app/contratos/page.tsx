'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FileText, Plus, Edit2, Trash2, Eye, Calendar, DollarSign, 
  Building2, User, Search, Filter, ChevronLeft 
} from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'

export default function ContratosList() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [filtro, setFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<string>('')
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

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este contrato?')) {
      const novosList = contratos.filter(c => c.id !== id)
      setContratos(novosList)
      localStorage.setItem('contratos', JSON.stringify(novosList))
    }
  }

  const contratosFiltrados = contratos.filter(c => {
    const matchText = 
      c.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      c.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
      c.motorista.toLowerCase().includes(filtro.toLowerCase())
    
    const matchStatus = statusFiltro === '' || c.status === statusFiltro

    return matchText && matchStatus
  })

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

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contratos</h1>
          <Link href="/contratos/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contrato
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle>Filtrar Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por título, empresa ou motorista..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFiltro === '' ? 'default' : 'outline'}
                  onClick={() => setStatusFiltro('')}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFiltro === 'ativo' ? 'default' : 'outline'}
                  onClick={() => setStatusFiltro('ativo')}
                >
                  Ativos
                </Button>
                <Button
                  variant={statusFiltro === 'vencido' ? 'default' : 'outline'}
                  onClick={() => setStatusFiltro('vencido')}
                >
                  Vencidos
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Mostrando {contratosFiltrados.length} de {contratos.length} contrato(s)
            </p>
          </CardContent>
        </Card>

        {/* Lista de Contratos */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">Carregando contratos...</p>
              </CardContent>
            </Card>
          ) : contratosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">Nenhum contrato encontrado</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  {filtro || statusFiltro ? 'Tente ajustar os filtros' : 'Crie seu primeiro contrato para começar'}
                </p>
              </CardContent>
            </Card>
          ) : (
            contratosFiltrados.map(contrato => (
              <Card key={contrato.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {contrato.titulo}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {contrato.descricao}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(contrato.status)}`}>
                          {getStatusLabel(contrato.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Building2 className="w-4 h-4" />
                          <span>{contrato.empresa}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <User className="w-4 h-4" />
                          <span>{contrato.motorista}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>Até {formatarData(contrato.dataVencimento)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatarValor(contrato.valor)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 md:flex-col">
                      <Link href={`/contratos/${contrato.id}`}>
                        <Button variant="outline" size="sm" className="w-full md:w-10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/contratos/${contrato.id}/editar`}>
                        <Button variant="outline" size="sm" className="w-full md:w-10">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full md:w-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                        onClick={() => handleDelete(contrato.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
