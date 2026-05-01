import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Contrato } from "@/hooks/use-contratos";

interface Stats {
  total: number;
  ativos: number;
  vencidos: number;
  pendentes: number;
  cancelados: number;
  valorTotal: number;
  valorAtivos: number;
}

export const exportarParaExcel = async (
  contratos: Contrato[],
  stats: Stats,
) => {
  const workbook = new ExcelJS.Workbook();

  // Calcular métricas
  const ticketMedio = stats.total > 0 ? stats.valorTotal / stats.total : 0;
  const ticketMedioAtivos =
    stats.ativos > 0 ? stats.valorAtivos / stats.ativos : 0;
  const percentualAtivos =
    stats.total > 0 ? (stats.ativos / stats.total) * 100 : 0;

  // Aba 1: Resumo
  const resumoSheet = workbook.addWorksheet("Resumo");
  resumoSheet.columns = [{ width: 30 }, { width: 20 }];

  // Estilos para cabeçalho
  const headerStyle = {
    font: { bold: true, size: 14, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3A6E" } },
    alignment: { horizontal: "left", vertical: "center" },
  };

  resumoSheet.addRow(["RELATÓRIO DE CONTRATOS"]).font = {
    bold: true,
    size: 14,
  };
  resumoSheet.addRow(["Gerado em:", new Date().toLocaleString("pt-BR")]);
  resumoSheet.addRow([]);

  resumoSheet.addRow(["RESUMO EXECUTIVO"]).font = { bold: true, size: 12 };
  resumoSheet.addRow(["Total de Contratos:", stats.total]);
  resumoSheet.addRow(["Contratos Ativos:", stats.ativos]);
  resumoSheet.addRow(["Contratos Vencidos:", stats.vencidos]);
  resumoSheet.addRow(["Contratos Pendentes:", stats.pendentes]);
  resumoSheet.addRow(["Contratos Cancelados:", stats.cancelados]);
  resumoSheet.addRow([]);

  resumoSheet.addRow(["ANÁLISE FINANCEIRA"]).font = { bold: true, size: 12 };
  resumoSheet.addRow(["Valor Total:", formatarValor(stats.valorTotal)]);
  resumoSheet.addRow(["Valor de Ativos:", formatarValor(stats.valorAtivos)]);
  resumoSheet.addRow(["Ticket Médio:", formatarValor(ticketMedio)]);
  resumoSheet.addRow([
    "Ticket Médio (Ativos):",
    formatarValor(ticketMedioAtivos),
  ]);
  resumoSheet.addRow([]);

  resumoSheet.addRow(["INDICADORES"]).font = { bold: true, size: 12 };
  resumoSheet.addRow([
    "% Contratos Ativos:",
    `${percentualAtivos.toFixed(1)}%`,
  ]);
  resumoSheet.addRow(["Taxa de Ocupação:", `${percentualAtivos.toFixed(1)}%`]);

  // Aba 2: Lista de Contratos
  const contratosSheet = workbook.addWorksheet("Contratos");
  contratosSheet.columns = [
    { width: 30 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 15 },
    { width: 18 },
    { width: 15 },
  ];

  contratosSheet.addRow([
    "ID",
    "Título",
    "Descrição",
    "Empresa",
    "Motorista",
    "Status",
    "Data de Vencimento",
    "Valor",
  ]).font = { bold: true };

  contratos.forEach((c) => {
    contratosSheet.addRow([
      c.id,
      c.titulo,
      c.descricao,
      c.empresa,
      c.motorista,
      c.status,
      new Date(c.dataVencimento).toLocaleDateString("pt-BR"),
      c.valor,
    ]);
  });

  // Aba 3: Análise por Status
  const statusSheet = workbook.addWorksheet("Por Status");
  statusSheet.columns = [
    { width: 20 },
    { width: 15 },
    { width: 20 },
    { width: 18 },
    { width: 18 },
  ];

  statusSheet.addRow([
    "Status",
    "Quantidade",
    "Valor Total",
    "Ticket Médio",
    "% do Total",
  ]).font = { bold: true };

  const statusData = [
    {
      nome: "Ativos",
      status: "ativo",
      quantidade: stats.ativos,
    },
    {
      nome: "Vencidos",
      status: "vencido",
      quantidade: stats.vencidos,
    },
    {
      nome: "Pendentes",
      status: "pendente",
      quantidade: stats.pendentes,
    },
    {
      nome: "Cancelados",
      status: "cancelado",
      quantidade: stats.cancelados,
    },
  ];

  statusData.forEach((item) => {
    const contratosPorStatus = contratos.filter(
      (c) => c.status === item.status,
    );
    const valorTotal = contratosPorStatus.reduce((acc, c) => acc + c.valor, 0);
    const ticketMedio = item.quantidade > 0 ? valorTotal / item.quantidade : 0;
    const percentualValor =
      stats.valorTotal > 0 ? (valorTotal / stats.valorTotal) * 100 : 0;

    statusSheet.addRow([
      item.nome,
      item.quantidade,
      formatarValor(valorTotal),
      formatarValor(ticketMedio),
      `${percentualValor.toFixed(1)}%`,
    ]);
  });

  // Aba 4: Resumo por Empresa
  const empresaSheet = workbook.addWorksheet("Por Empresa");
  empresaSheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 20 },
    { width: 18 },
  ];

  empresaSheet.addRow([
    "Empresa",
    "Quantidade",
    "Valor Total",
    "Ticket Médio",
  ]).font = { bold: true };

  const empresas = [...new Set(contratos.map((c) => c.empresa))];
  empresas.forEach((empresa) => {
    const contratosEmpresa = contratos.filter((c) => c.empresa === empresa);
    const valorTotal = contratosEmpresa.reduce((acc, c) => acc + c.valor, 0);
    const ticketMedio =
      contratosEmpresa.length > 0 ? valorTotal / contratosEmpresa.length : 0;

    empresaSheet.addRow([
      empresa,
      contratosEmpresa.length,
      formatarValor(valorTotal),
      formatarValor(ticketMedio),
    ]);
  });

  // Gerar e baixar arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-contratos-${new Date().toISOString().split("T")[0]}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportarParaPDF = (contratos: Contrato[], stats: Stats) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 10;
  const marginTop = 10;
  let currentY = marginTop;

  // Calcular métricas
  const ticketMedio = stats.total > 0 ? stats.valorTotal / stats.total : 0;
  const ticketMedioAtivos =
    stats.ativos > 0 ? stats.valorAtivos / stats.ativos : 0;
  const percentualAtivos =
    stats.total > 0 ? (stats.ativos / stats.total) * 100 : 0;

  // Configurar cores
  doc.setTextColor(30, 40, 60); // Cor escura para texto

  // Título
  doc.setFontSize(20);
  doc.text("RELATÓRIO DE CONTRATOS", marginLeft, currentY);
  currentY += 10;

  // Data
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
    marginLeft,
    currentY,
  );
  currentY += 8;

  // Linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
  currentY += 5;

  // Resumo Executivo
  doc.setTextColor(30, 40, 60);
  doc.setFontSize(14);
  doc.text("RESUMO EXECUTIVO", marginLeft, currentY);
  currentY += 8;

  const resumoItems = [
    [`Total de Contratos: ${stats.total}`],
    [`Contratos Ativos: ${stats.ativos}`],
    [`Contratos Vencidos: ${stats.vencidos}`],
    [`Contratos Pendentes: ${stats.pendentes}`],
    [`Contratos Cancelados: ${stats.cancelados}`],
    [`% Contratos Ativos: ${percentualAtivos.toFixed(1)}%`],
  ];

  doc.setFontSize(11);
  resumoItems.forEach((item) => {
    if (currentY > pageHeight - 20) {
      doc.addPage();
      currentY = marginTop;
    }
    doc.text(item[0], marginLeft + 5, currentY);
    currentY += 6;
  });

  currentY += 3;

  // Análise Financeira
  doc.setFontSize(14);
  doc.setTextColor(30, 40, 60);
  doc.text("ANÁLISE FINANCEIRA", marginLeft, currentY);
  currentY += 8;

  const financasItems = [
    [`Valor Total: ${formatarValor(stats.valorTotal)}`],
    [`Valor de Ativos: ${formatarValor(stats.valorAtivos)}`],
    [`Ticket Médio: ${formatarValor(ticketMedio)}`],
    [`Ticket Médio (Ativos): ${formatarValor(ticketMedioAtivos)}`],
  ];

  doc.setFontSize(11);
  financasItems.forEach((item) => {
    if (currentY > pageHeight - 20) {
      doc.addPage();
      currentY = marginTop;
    }
    doc.text(item[0], marginLeft + 5, currentY);
    currentY += 6;
  });

  currentY += 5;

  // Tabela por Status
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = marginTop;
  }

  doc.setFontSize(12);
  doc.setTextColor(30, 40, 60);
  doc.text("ANÁLISE POR STATUS", marginLeft, currentY);
  currentY += 8;

  const tableColumnStatus = [
    "Status",
    "Quantidade",
    "Valor Total",
    "Ticket Médio",
  ];
  const tableRowsStatus: string[][] = [];

  const statusData = [
    { nome: "Ativos", status: "ativo" },
    { nome: "Vencidos", status: "vencido" },
    { nome: "Pendentes", status: "pendente" },
    { nome: "Cancelados", status: "cancelado" },
  ];

  statusData.forEach((item) => {
    const contratosPorStatus = contratos.filter(
      (c) => c.status === item.status,
    );
    const valorTotal = contratosPorStatus.reduce((acc, c) => acc + c.valor, 0);
    const ticketMedio =
      contratosPorStatus.length > 0
        ? valorTotal / contratosPorStatus.length
        : 0;

    tableRowsStatus.push([
      item.nome,
      contratosPorStatus.length.toString(),
      formatarValor(valorTotal),
      formatarValor(ticketMedio),
    ]);
  });

  autoTable(doc, {
    head: [tableColumnStatus],
    body: tableRowsStatus,
    startY: currentY,
    margin: marginLeft,
    headStyles: {
      fillColor: [30, 40, 60],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = marginTop;
  }

  // Linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
  currentY += 8;

  // Tabela de Contratos
  doc.setFontSize(12);
  doc.setTextColor(30, 40, 60);
  doc.text("LISTA DE CONTRATOS", marginLeft, currentY);
  currentY += 8;

  // Adicionar tabela
  const tableColumn = [
    "Título",
    "Empresa",
    "Motorista",
    "Status",
    "Vencimento",
    "Valor",
  ];
  const tableRows: string[][] = [];

  contratos.forEach((contrato) => {
    tableRows.push([
      contrato.titulo.substring(0, 20),
      contrato.empresa.substring(0, 15),
      contrato.motorista.substring(0, 15),
      contrato.status,
      new Date(contrato.dataVencimento).toLocaleDateString("pt-BR"),
      formatarValor(contrato.valor),
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: currentY,
    margin: marginLeft,
    headStyles: {
      fillColor: [30, 40, 60],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Salvar arquivo
  doc.save(`relatorio-contratos-${new Date().toISOString().split("T")[0]}.pdf`);
};

export const exportarParaJSON = (contratos: Contrato[], stats: Stats) => {
  const relatorio = {
    geradoEm: new Date().toLocaleString("pt-BR"),
    resumo: stats,
    contratos: contratos,
  };

  const dataStr = JSON.stringify(relatorio, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-contratos-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};
