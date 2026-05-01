package com.malloc.backend_contratos.business.dto;

public record NotificacaoResponse(
		String id,
		String contratoId,
		String tituloContrato,
		String tipo,
		String mensagem,
		Boolean lida,
		String dataNotificacao,
		Integer diasAntecedencia) {
}


