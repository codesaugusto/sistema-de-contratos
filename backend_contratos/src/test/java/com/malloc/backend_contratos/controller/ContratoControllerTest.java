package com.malloc.backend_contratos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.server.ResponseStatusException;

import com.malloc.backend_contratos.business.ContratoService;
import com.malloc.backend_contratos.business.dto.ContratoHistoricoResponse;
import com.malloc.backend_contratos.business.dto.ContratoRequest;
import com.malloc.backend_contratos.business.dto.ContratoResponse;
import com.malloc.backend_contratos.business.dto.ContratoResumoResponse;
import com.malloc.backend_contratos.business.dto.DashboardStats;
import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(ContratoController.class)
@AutoConfigureMockMvc(addFilters = false)
class ContratoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private ContratoService contratoService;

	@Test
	void deveListarContratos() throws Exception {
		ContratoResponse response = contratoResponse();
		when(contratoService.listarTodos(any(Pageable.class)))
				.thenReturn(new PageImpl<>(List.of(response), PageRequest.of(0, 20), 1));

		mockMvc.perform(get("/contratos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content[0].motorista").value("Motorista A"))
				.andExpect(jsonPath("$.content[0].status").value("ativo"));
	}

	@Test
	void deveBuscarContratoPorId() throws Exception {
		ContratoResponse response = contratoResponse();
		when(contratoService.buscarPorId(response.id())).thenReturn(response);

		mockMvc.perform(get("/contratos/{id}", response.id()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.empresa").value("Empresa X"));
	}

	@Test
	void deveListarHistoricoDoContrato() throws Exception {
		UUID id = UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377");
		ContratoHistoricoResponse response = new ContratoHistoricoResponse(
				UUID.fromString("22222222-2222-2222-2222-222222222222").toString(),
				id.toString(),
				2,
				Map.of("titulo", "Contrato atualizado"),
				"2026-04-15T10:15:30Z",
				"Ajuste contratual");
		when(contratoService.listarHistorico(id)).thenReturn(List.of(response));

		mockMvc.perform(get("/contratos/{id}/historico", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].contratoId").value(id.toString()))
				.andExpect(jsonPath("$[0].versao").value(2))
				.andExpect(jsonPath("$[0].alteracoes.titulo").value("Contrato atualizado"))
				.andExpect(jsonPath("$[0].dataAlteracao").value("2026-04-15T10:15:30Z"));
	}

	@Test
	void deveCriarContrato() throws Exception {
		ContratoRequest request = contratoRequest();
		ContratoResponse response = contratoResponse();
		when(contratoService.criar(request)).thenReturn(response);

		mockMvc.perform(post("/contratos")
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsBytes(request)))
				.andExpect(status().isCreated())
				.andExpect(header().string("Location", "http://localhost/contratos/" + response.id()))
				.andExpect(jsonPath("$.titulo").value("Contrato anual"))
				.andExpect(jsonPath("$.descricao").value("Contrato anual de transporte"));
	}

	@Test
	void deveAtualizarContrato() throws Exception {
		ContratoRequest request = contratoRequest();
		ContratoResponse response = contratoResponse();
		when(contratoService.atualizar(response.id(), request)).thenReturn(response);

		mockMvc.perform(put("/contratos/{id}", response.id())
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsBytes(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.valor").value(2500.75));
	}

	@Test
	void deveRetornarDashboard() throws Exception {
		UUID id = UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377");
		DashboardStats dashboard = new DashboardStats(
				3,
				1,
				1,
				1,
				new BigDecimal("6400.00"),
				List.of(new ContratoResumoResponse(id, "Motorista A", "Empresa X", LocalDate.of(2026, 5, 1),
						new BigDecimal("2500.75"), StatusContrato.ATIVO)),
				2);
		when(contratoService.obterDashboard()).thenReturn(dashboard);

		mockMvc.perform(get("/contratos/dashboard"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalContratos").value(3))
				.andExpect(jsonPath("$.proximosVencimentos[0].motorista").value("Motorista A"));
	}

	@Test
	void deveRetornarNotFoundQuandoContratoNaoExiste() throws Exception {
		UUID id = UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377");
		when(contratoService.buscarPorId(id))
				.thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado."));

		mockMvc.perform(get("/contratos/{id}", id))
				.andExpect(status().isNotFound());
	}

	@Test
	void deveRetornarNotFoundQuandoHistoricoDoContratoNaoExiste() throws Exception {
		UUID id = UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377");
		when(contratoService.listarHistorico(id))
				.thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado."));

		mockMvc.perform(get("/contratos/{id}/historico", id))
				.andExpect(status().isNotFound());
	}

	@Test
	void deveValidarPayloadNaCriacao() throws Exception {
		ContratoRequest invalido = new ContratoRequest(
				"",
				"Empresa X",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("2500.75"),
				StatusContrato.ATIVO,
				"Contrato anual",
				"Contrato anual de transporte",
				List.of("anexo.pdf"));

		mockMvc.perform(post("/contratos")
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsBytes(invalido)))
				.andExpect(status().isBadRequest());
	}

	private ContratoRequest contratoRequest() {
		return new ContratoRequest(
				"Motorista A",
				"Empresa X",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("2500.75"),
				StatusContrato.ATIVO,
				"Contrato anual",
				"Contrato anual de transporte",
				List.of("anexo.pdf"));
	}

	private ContratoResponse contratoResponse() {
		UUID id = UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377");
		return new ContratoResponse(
				id,
				"Motorista A",
				"Empresa X",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("2500.75"),
				StatusContrato.ATIVO,
				"Contrato anual",
				"Contrato anual de transporte",
				List.of("anexo.pdf"),
				Instant.parse("2026-04-01T10:15:30Z"),
				Instant.parse("2026-04-15T10:15:30Z"));
	}
}

