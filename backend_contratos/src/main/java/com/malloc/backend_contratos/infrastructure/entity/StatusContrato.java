package com.malloc.backend_contratos.infrastructure.entity;

import java.util.Arrays;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusContrato {
	ATIVO("ativo"),
	VENCIDO("vencido"),
	EXPIRANDO("expirando"),
	PENDENTE("pendente"),
	CANCELADO("cancelado"),
	RENOVADO("renovado");

	private final String valor;

	StatusContrato(String valor) {
		this.valor = valor;
	}

	@JsonValue
	public String getValor() {
		return valor;
	}

	@JsonCreator
	public static StatusContrato fromValor(String valor) {
		return Arrays.stream(values())
				.filter(status -> status.valor.equalsIgnoreCase(valor))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Status de contrato inválido: " + valor));
	}
}

