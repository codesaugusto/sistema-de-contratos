package com.malloc.backend_contratos.infrastructure.entity;

import java.util.Arrays;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoNotificacao {
	VENCIMENTO("vencimento"),
	AVISO("aviso"),
	RENOVACAO("renovacao");

	private final String valor;

	TipoNotificacao(String valor) {
		this.valor = valor;
	}

	@JsonValue
	public String getValor() {
		return valor;
	}

	@JsonCreator
	public static TipoNotificacao fromValor(String valor) {
		return Arrays.stream(values())
				.filter(tipo -> tipo.valor.equalsIgnoreCase(valor))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Tipo de notificação inválido: " + valor));
	}
}

