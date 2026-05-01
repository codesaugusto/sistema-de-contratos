package com.malloc.backend_contratos.business.converter;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

import com.malloc.backend_contratos.business.dto.NotificacaoResponse;
import com.malloc.backend_contratos.infrastructure.entity.NotificacaoContrato;

@Component
public class NotificacaoConverter {

	public NotificacaoResponse paraNotificacaoResponse(NotificacaoContrato notificacao) {
		String contratoId = notificacao.getContrato() != null
				? notificacao.getContrato().getId().toString()
				: notificacao.getContratoIdSnapshot() == null ? null : notificacao.getContratoIdSnapshot().toString();
		String tituloContrato = notificacao.getContrato() != null
				? notificacao.getContrato().getTitulo()
				: notificacao.getTituloContratoSnapshot();

		return new NotificacaoResponse(
				notificacao.getId().toString(),
				contratoId,
				tituloContrato,
				notificacao.getTipo().name(),
				notificacao.getMensagem(),
				notificacao.getLida(),
				DateTimeFormatter.ISO_INSTANT.format(notificacao.getDataNotificacao()),
				notificacao.getDiasAntecedencia());
	}
}

