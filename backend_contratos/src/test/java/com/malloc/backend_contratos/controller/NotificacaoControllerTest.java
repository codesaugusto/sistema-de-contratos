package com.malloc.backend_contratos.controller;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.malloc.backend_contratos.business.NotificacaoService;
import com.malloc.backend_contratos.business.dto.NotificacaoResponse;

@WebMvcTest(NotificacaoController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificacaoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private NotificacaoService notificacaoService;

	@Test
	void deveListarNotificacoes() throws Exception {
		NotificacaoResponse response = notificacaoResponse();
		when(notificacaoService.listar()).thenReturn(List.of(response));

		mockMvc.perform(get("/notificacoes"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value("11111111-1111-1111-1111-111111111111"))
				.andExpect(jsonPath("$[0].contratoId").value("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377"))
				.andExpect(jsonPath("$[0].tipo").value("VENCIMENTO"));
	}

	@Test
	void deveListarNotificacoesNaoLidas() throws Exception {
		NotificacaoResponse response = notificacaoResponse();
		when(notificacaoService.listarNaoLidas()).thenReturn(List.of(response));

		mockMvc.perform(get("/notificacoes/nao-lidas"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].lida").value(false));
	}

	@Test
	void deveMarcarNotificacaoComoLida() throws Exception {
		UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");

		mockMvc.perform(patch("/notificacoes/{id}/lida", id))
				.andExpect(status().isNoContent());
	}

	@Test
	void deveMarcarTodasComoLidas() throws Exception {
		mockMvc.perform(patch("/notificacoes/marcar-todas-lidas"))
				.andExpect(status().isNoContent());
	}

	@Test
	void deveRetornarNotFoundQuandoNotificacaoNaoExiste() throws Exception {
		UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
		doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificação não encontrada."))
				.when(notificacaoService).marcarComoLida(id);

		mockMvc.perform(patch("/notificacoes/{id}/lida", id))
				.andExpect(status().isNotFound());
	}

	private NotificacaoResponse notificacaoResponse() {
		return new NotificacaoResponse(
				"11111111-1111-1111-1111-111111111111",
				"f8b9b3ba-8e9e-4d69-a0dc-c001457fc377",
				"Contrato anual",
				"VENCIMENTO",
				"Contrato vence em 7 dias",
				false,
				"2026-04-20T10:15:30Z",
				7);
	}
}

