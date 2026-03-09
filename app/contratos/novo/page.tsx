'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Save } from 'lucide-react'
import type { Contrato } from '@/hooks/use-contratos'

export default function NovoContrato() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    valor: 0,
    empresa: '',
    motorista: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      if (!formData.titulo.trim()) {
        setErro('Título é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.dataVencimento) {
        setErro('Data de vencimento é obrigatória')
        setLoading(false)
        return
      }

      if (new Date(formData.dataVencimento) <= new Date(formData.dataInicio)) {
        setErro('Data de vencimento deve ser após a data de início')
        setLoading(false)
        return
      }

      if (formData.valor <= 0) {
        setErro('Valor deve ser maior que zero')
        setLoading(false)
        return
      }

      const contratos = JSON.parse(localStorage.getItem('contratos') || '[]') as Contrato[]

      const novoContrato: Contrato = {
        id: Date.now().toString(),
        ...formData,
        status: 'ativo',
        documentos: [],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      }

      contratos.push(novoContrato)
      localStorage.setItem('contratos', JSON.stringify(contratos))

      // Adicionar ao histórico
      const historico = JSON.parse(localStorage.getItem('historico-contratos') || '[]')
      historico.unshift({
        id: Date.now().toString(),
        contratoId: novoContrato.id,
        acao: 'criado',
        alteracoes: { novo: novoContrato },
        dataAlteracao: new Date().toISOString(),
      })
      localStorage.setItem('historico-contratos', JSON.stringify(historico))

      router.push('/contratos')
    } catch (err) {
      setErro('Erro ao salvar contrato')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/contratos" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span>Contratos</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Novo Contrato</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Contrato</CardTitle>
            <CardDescription>
              Preencha os dados do contrato para adicioná-lo ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {erro && (
                <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-200">{erro}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Título do Contrato *
                  </label>
                  <Input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Contrato de Trabalho - Rota 101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Empresa *
                  </label>
                  <Input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    placeholder="Nome da empresa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Motorista (Seu Nome) *
                  </label>
                  <Input
                    type="text"
                    name="motorista"
                    value={formData.motorista}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Valor do Contrato (R$) *
                  </label>
                  <Input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Data de Início *
                  </label>
                  <Input
                    type="date"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Data de Vencimento *
                  </label>
                  <Input
                    type="date"
                    name="dataVencimento"
                    value={formData.dataVencimento}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o contrato..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Contrato'}
                </Button>
                <Link href="/contratos">
                  <Button variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
