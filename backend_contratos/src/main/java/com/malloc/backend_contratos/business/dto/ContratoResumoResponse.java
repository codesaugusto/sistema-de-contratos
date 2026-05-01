package com.malloc.backend_contratos.business.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;

public record ContratoResumoResponse(
		UUID id,
		String motorista,
		String empresa,
		LocalDate dataVencimento,
		BigDecimal valor,
		StatusContrato status) {
}

