package com.malloc.backend_contratos.business.converter;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.malloc.backend_contratos.business.dto.ContratoHistoricoResponse;
import com.malloc.backend_contratos.infrastructure.entity.ContratoHistorico;

@Component
public class ContratoHistoricoConverter {

	public ContratoHistoricoResponse paraContratoHistoricoResponse(ContratoHistorico contratoHistorico) {
		return new ContratoHistoricoResponse(
				contratoHistorico.getId().toString(),
				contratoHistorico.getContrato().getId().toString(),
				contratoHistorico.getVersao(),
				paraAlteracoesResponse(contratoHistorico.getAlteracoes()),
				DateTimeFormatter.ISO_INSTANT.format(contratoHistorico.getDataAlteracao()),
				contratoHistorico.getMotivo());
	}

	public Map<String, String> paraAlteracoesResponse(Map<String, String> alteracoes) {
		return alteracoes == null ? Map.of() : new LinkedHashMap<>(alteracoes);
	}
}

