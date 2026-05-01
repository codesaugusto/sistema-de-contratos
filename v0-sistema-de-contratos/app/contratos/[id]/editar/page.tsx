"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Save } from "lucide-react";
import type { Contrato } from "@/hooks/use-contratos";
import { Header } from "@/components/header";
import { HeaderMobile } from "@/components/header-mobile";
import { useIsMobile } from "@/components/ui/use-mobile";
import { contratosApi } from "@/lib/api";

export default function EditarContrato() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [contrato, setContrato] = useState<Contrato | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataVencimento: "",
    valor: 0,
    empresa: "",
    motorista: "",
    anexos: [] as string[],
    status: "" as
      | "ativo"
      | "vencido"
      | "pendente"
      | "cancelado"
      | "renovado"
      | "expirando",
    atualizadoEm: "",
  });

  useEffect(() => {
    contratosApi
      .buscarPorId(id)
      .then((encontrado) => {
        setContrato(encontrado);
        setFormData({
          titulo: encontrado.titulo,
          descricao: encontrado.descricao,
          dataInicio: encontrado.dataInicio,
          dataVencimento: encontrado.dataVencimento,
          valor: encontrado.valor,
          empresa: encontrado.empresa,
          motorista: encontrado.motorista,
          anexos: encontrado.anexos ?? [],
          status: encontrado.status,
          atualizadoEm: encontrado.atualizadoEm,
        });
      })
      .catch(() => setContrato(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valor" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setSaving(true);

    try {
      if (!formData.titulo.trim()) {
        setErro("Título é obrigatório");
        setSaving(false);
        return;
      }

      if (!formData.dataVencimento) {
        setErro("Data de vencimento é obrigatória");
        setSaving(false);
        return;
      }

      if (new Date(formData.dataVencimento) <= new Date(formData.dataInicio)) {
        setErro("Data de vencimento deve ser após a data de início");
        setSaving(false);
        return;
      }

      if (formData.valor <= 0) {
        setErro("Valor deve ser maior que zero");
        setSaving(false);
        return;
      }

      const statusUpper = (formData.status ?? "").toUpperCase();
      const payload: Partial<Omit<Contrato, "id" | "criadoEm">> = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        dataInicio: formData.dataInicio,
        dataVencimento: formData.dataVencimento,
        valor: formData.valor,
        empresa: formData.empresa,
        motorista: formData.motorista,
        anexos: formData.anexos,
        status: statusUpper as any,
      };

      await contratosApi.atualizar(id, payload);

      router.push(`/contratos/${id}`);
    } catch (err) {
      setErro("Erro ao atualizar contrato");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {isMobile ? <HeaderMobile /> : <Header />}
        <main
          className={`${isMobile ? "px-4 py-4" : "max-w-4xl mx-auto px-6 py-8"}`}
        >
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Contrato não encontrado
            </p>
            <Link href="/contratos">
              <Button variant="outline" className="mt-4">
                Voltar para Contratos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Editar Contrato
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Atualize os dados do contrato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {erro && (
                <div className="p-4 bg-red-50 dark:bg-slate-900 border border-[var(--error-vencido)]/20 dark:border-slate-700 rounded-lg">
                  <p className="text-sm text-[var(--error-vencido)] dark:text-red-200">
                    {erro}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
                    Título do Contrato *
                  </label>
                  <Input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Contrato de Trabalho - Rota 101"
                    required
                    className="border border-[var(--border-default)] dark:border-slate-700 focus:outline-none focus:!border-[var(--sky-trust)] dark:focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
                    Empresa *
                  </label>
                  <Input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    placeholder="Nome da empresa"
                    required
                    className="border border-[var(--border-default)] dark:border-slate-700 focus:outline-none focus:!border-[var(--sky-trust)] dark:focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
                    Motorista (Seu Nome) *
                  </label>
                  <Input
                    type="text"
                    name="motorista"
                    value={formData.motorista}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                    className="border border-[var(--border-default)] dark:border-slate-700 focus:outline-none focus:!border-[var(--sky-trust)] dark:focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
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
                    className="border border-[var(--border-default)] dark:border-slate-700 focus:outline-none focus:!border-[var(--sky-trust)] dark:focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
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

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
                    Status *
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "status", value } } as any)
                    }
                  >
                    <SelectTrigger className="border border-[var(--border-default)] dark:border-slate-700 dark:bg-[#151B29]">
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="renovado">Renovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--steel-light)] dark:text-slate-400 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o contrato..."
                  className="w-full px-3 py-2 border border-[var(--border-default)] rounded-lg bg-white dark:border-slate-700 dark:bg-[#151B29] text-slate-900 dark:text-white focus:outline-none focus:!border-[var(--sky-trust)] dark:focus:border-slate-600"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--sky-trust)] hover:bg-[var(--sky-trust)]/90 dark:text-white cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Link href={`/contratos/${id}`}>
                  <Button
                    variant="outline"
                    className="border border-[var(--border-default)] dark:border-slate-700 text-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer"
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
