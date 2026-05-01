package com.malloc.backend_contratos.business.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;

public record ContratoResponse(
		UUID id,
		String motorista,
		String empresa,
		LocalDate dataInicio,
		LocalDate dataVencimento,
		BigDecimal valor,
		StatusContrato status,
		String titulo,
		String descricao,
		List<String> anexos,
		Instant criadoEm,
		Instant atualizadoEm) {
}

