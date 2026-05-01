package com.malloc.backend_contratos.business.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStats(
		long totalContratos,
		long contratosAtivos,
		long contratosVencidos,
		long contratosExpirando,
		BigDecimal valorTotal,
		List<ContratoResumoResponse> proximosVencimentos,
		long alertasNaoLidos) {
}

