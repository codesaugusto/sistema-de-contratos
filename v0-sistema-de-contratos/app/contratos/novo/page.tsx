"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { ChevronLeft, Save } from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { useIsMobile } from "@/components/ui/use-mobile";
import { contratosApi } from "@/lib/api";

export default function NovoContrato() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: new Date().toISOString().split("T")[0],
    dataVencimento: "",
    valor: 0,
    empresa: "",
    motorista: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valor" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      if (!formData.titulo.trim()) {
        setErro("Título é obrigatório");
        setLoading(false);
        return;
      }

      if (!formData.dataVencimento) {
        setErro("Data de vencimento é obrigatória");
        setLoading(false);
        return;
      }

      if (new Date(formData.dataVencimento) <= new Date(formData.dataInicio)) {
        setErro("Data de vencimento deve ser após a data de início");
        setLoading(false);
        return;
      }

      if (formData.valor <= 0) {
        setErro("Valor deve ser maior que zero");
        setLoading(false);
        return;
      }

      await contratosApi.criar({
        ...formData,
        status: "ativo",
        anexos: [],
      });

      router.push("/contratos");
    } catch (err) {
      setErro("Erro ao salvar contrato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {isMobile ? <HeaderMobile /> : <Header />}

      {/* Main Content */}
      <main
        className={`${isMobile ? "px-4 py-4" : "max-w-4xl mx-auto px-6 py-8"}`}
      >
        <Card className="bg-white dark:bg-slate-900 border border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Cadastrar Novo Contrato
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Preencha os dados do contrato para adicioná-lo ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {erro && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {erro}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Título do Contrato *
                  </label>
                  <Input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Contrato de Trabalho - Rota 101"
                    className="border border-[var(--border-default)] dark:bg-slate-800 dark:text-slate-50 focus:ring-[var(--sky-trust)] focus:ring-1 focus:!border-[var(--sky-trust)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Empresa *
                  </label>
                  <Input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    placeholder="Nome da empresa"
                    className="border border-[var(--border-default)] dark:bg-slate-800 dark:text-slate-50 focus:ring-[var(--sky-trust)] focus:ring-1 focus:!border-[var(--sky-trust)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Motorista (Seu Nome) *
                  </label>
                  <Input
                    type="text"
                    name="motorista"
                    value={formData.motorista}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="border border-[var(--border-default)] dark:bg-slate-800 dark:text-slate-50 focus:ring-[var(--sky-trust)] focus:ring-1 focus:!border-[var(--sky-trust)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Valor do Contrato (R$) *
                  </label>
                  <Input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="0,00"
                    className="border border-[var(--border-default)] dark:bg-slate-800 dark:text-slate-50 focus:ring-[var(--sky-trust)] focus:ring-1 focus:!border-[var(--sky-trust)] tabular-nums"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Data de Início *
                  </label>
                  <DatePicker
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={(date) =>
                      handleChange({
                        target: { name: "dataInicio", value: date },
                      } as any)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Data de Vencimento *
                  </label>
                  <DatePicker
                    name="dataVencimento"
                    value={formData.dataVencimento}
                    onChange={(date) =>
                      handleChange({
                        target: { name: "dataVencimento", value: date },
                      } as any)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o contrato..."
                  className="w-full px-3 py-2 border border-[var(--border-default)] rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-1 focus:ring-[var(--sky-trust)] focus:!border-[var(--sky-trust)]"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 text-white cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Contrato"}
                </Button>
                <Link href="/contratos">
                  <Button
                    variant="outline"
                    className="border border-[var(--border-default)] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
