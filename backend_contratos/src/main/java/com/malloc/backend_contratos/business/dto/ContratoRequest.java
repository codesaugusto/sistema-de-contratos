package com.malloc.backend_contratos.business.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContratoRequest(
		@NotBlank @Size(max = 120) String motorista,
		@NotBlank @Size(max = 120) String empresa,
		@NotNull LocalDate dataInicio,
		@NotNull LocalDate dataVencimento,
		@NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal valor,
		@NotNull StatusContrato status,
		@NotBlank @Size(max = 2000) String titulo,
		@NotBlank @Size(max = 2000) String descricao,
		@NotNull List<@NotBlank @Size(max = 1000) String> anexos) {
}

