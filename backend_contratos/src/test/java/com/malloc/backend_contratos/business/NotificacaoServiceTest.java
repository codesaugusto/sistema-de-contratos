package com.malloc.backend_contratos.business;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.malloc.backend_contratos.business.converter.NotificacaoConverter;
import com.malloc.backend_contratos.business.dto.NotificacaoResponse;
import com.malloc.backend_contratos.infrastructure.entity.Contrato;
import com.malloc.backend_contratos.infrastructure.entity.NotificacaoContrato;
import com.malloc.backend_contratos.infrastructure.entity.TipoNotificacao;
import com.malloc.backend_contratos.infrastructure.repository.NotificacaoContratoRepository;

@ExtendWith(MockitoExtension.class)
class NotificacaoServiceTest {

	@Mock
	private NotificacaoContratoRepository notificacaoContratoRepository;

	@Mock
	private NotificacaoConverter notificacaoConverter;

	@InjectMocks
	private NotificacaoService notificacaoService;

	@Test
	void deveListarNotificacoesConvertendoParaResponse() {
		NotificacaoContrato notificacao = notificacao(false);
		NotificacaoResponse response = response(notificacao);

		when(notificacaoContratoRepository.findAllOrdenadas()).thenReturn(List.of(notificacao));
		when(notificacaoConverter.paraNotificacaoResponse(notificacao)).thenReturn(response);

		List<NotificacaoResponse> notificacoes = notificacaoService.listar();

		assertThat(notificacoes).containsExactly(response);
	}

	@Test
	void deveListarNotificacoesNaoLidasConvertendoParaResponse() {
		NotificacaoContrato notificacao = notificacao(false);
		NotificacaoResponse response = response(notificacao);

		when(notificacaoContratoRepository.findNaoLidasOrdenadas()).thenReturn(List.of(notificacao));
		when(notificacaoConverter.paraNotificacaoResponse(notificacao)).thenReturn(response);

		List<NotificacaoResponse> notificacoes = notificacaoService.listarNaoLidas();

		assertThat(notificacoes).containsExactly(response);
	}

	@Test
	void deveMarcarNotificacaoComoLida() {
		UUID id = UUID.randomUUID();
		when(notificacaoContratoRepository.marcarComoLida(id)).thenReturn(1);

		notificacaoService.marcarComoLida(id);

		verify(notificacaoContratoRepository).marcarComoLida(id);
	}

	@Test
	void deveLancarNotFoundQuandoNotificacaoNaoExiste() {
		UUID id = UUID.randomUUID();
		when(notificacaoContratoRepository.marcarComoLida(id)).thenReturn(0);
		when(notificacaoContratoRepository.existsById(id)).thenReturn(false);

		assertThatThrownBy(() -> notificacaoService.marcarComoLida(id))
				.isInstanceOf(ResponseStatusException.class)
				.hasMessageContaining("404 NOT_FOUND");
	}

	@Test
	void deveMarcarTodasComoLidas() {
		notificacaoService.marcarTodasComoLidas();

		verify(notificacaoContratoRepository).marcarTodasComoLidas();
	}

	private NotificacaoContrato notificacao(boolean lida) {
		Contrato contrato = Contrato.builder()
				.id(UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377"))
				.titulo("Contrato anual")
				.build();

		return NotificacaoContrato.builder()
				.id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
				.contrato(contrato)
				.tipo(TipoNotificacao.VENCIMENTO)
				.mensagem("Contrato vence em 7 dias")
				.lida(lida)
				.dataNotificacao(Instant.parse("2026-04-20T10:15:30Z"))
				.diasAntecedencia(7)
				.build();
	}

	private NotificacaoResponse response(NotificacaoContrato notificacao) {
		return new NotificacaoResponse(
				notificacao.getId().toString(),
				notificacao.getContrato().getId().toString(),
				notificacao.getContrato().getTitulo(),
				notificacao.getTipo().name(),
				notificacao.getMensagem(),
				notificacao.getLida(),
				"2026-04-20T10:15:30Z",
				notificacao.getDiasAntecedencia());
	}
}

