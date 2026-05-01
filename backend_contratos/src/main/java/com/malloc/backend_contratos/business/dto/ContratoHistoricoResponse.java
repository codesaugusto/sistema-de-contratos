package com.malloc.backend_contratos.business.dto;

import java.util.Map;

public record ContratoHistoricoResponse(
		String id,
		String contratoId,
		Integer versao,
		Map<String, String> alteracoes,
		String dataAlteracao,
		String motivo) {
}

