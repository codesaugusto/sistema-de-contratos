package com.malloc.backend_contratos.business.dto;

import jakarta.validation.constraints.NotNull;

public record AtualizarStatusNotificacaoRequest(
	@NotNull(message = "Campo 'lida' é obrigatório")
	Boolean lida
) { }

