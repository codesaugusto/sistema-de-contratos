package com.malloc.backend_contratos.business;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.malloc.backend_contratos.business.dto.ContratoRequest;
import com.malloc.backend_contratos.business.dto.ContratoHistoricoResponse;
import com.malloc.backend_contratos.business.dto.ContratoResponse;
import com.malloc.backend_contratos.infrastructure.entity.Contrato;
import com.malloc.backend_contratos.infrastructure.entity.ContratoHistorico;
import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;
import com.malloc.backend_contratos.infrastructure.repository.ContratoHistoricoRepository;
import com.malloc.backend_contratos.infrastructure.repository.ContratoRepository;
import com.malloc.backend_contratos.infrastructure.repository.NotificacaoContratoRepository;

@SpringBootTest
class ContratoServiceIntegrationTest {

	@Autowired
	private ContratoService contratoService;

	@Autowired
	private ContratoRepository contratoRepository;

	@Autowired
	private ContratoHistoricoRepository contratoHistoricoRepository;

	@Autowired
	private NotificacaoContratoRepository notificacaoContratoRepository;

	@BeforeEach
	void limparBase() {
		contratoHistoricoRepository.deleteAll();
		notificacaoContratoRepository.deleteAll();
		contratoRepository.deleteAll();
	}

	@Test
	void deveCriarEAtualizarContratoRegistrandoHistoricoComVersoesSequenciais() {
		ContratoRequest criarRequest = new ContratoRequest(
				"Motorista Inicial",
				"Empresa Inicial",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("1500.00"),
				StatusContrato.ATIVO,
				"Contrato inicial",
				"Descricao inicial",
				List.of("contrato.pdf"));

		ContratoResponse criado = contratoService.criar(criarRequest);

		ContratoRequest atualizarRequest = new ContratoRequest(
				"Motorista Atualizado",
				"Empresa Inicial",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 6, 1),
				new BigDecimal("1800.00"),
				StatusContrato.EXPIRANDO,
				"Contrato atualizado",
				"Descricao atualizada",
				List.of("contrato.pdf", "aditivo.pdf"));

		contratoService.atualizar(criado.id(), atualizarRequest);
		List<ContratoHistoricoResponse> historicos = contratoService.listarHistorico(criado.id());

		assertThat(historicos).hasSize(2);
		assertThat(historicos.getFirst().versao()).isEqualTo(2);
		assertThat(historicos.get(1).versao()).isEqualTo(1);
		assertThat(historicos.getFirst().alteracoes()).containsEntry("motorista", "Motorista Atualizado");
	}

	@Test
	void deveListarHistoricoDoContratoNoFormatoEsperadoPeloFrontend() {
		Contrato contrato = contratoRepository.saveAndFlush(Contrato.builder()
				.motorista("Motorista Original")
				.empresa("Empresa Original")
				.dataInicio(LocalDate.of(2026, 4, 1))
				.dataVencimento(LocalDate.of(2026, 5, 1))
				.valor(new BigDecimal("1500.00"))
				.status(StatusContrato.ATIVO)
				.titulo("Contrato original")
				.descricao("Descricao original")
				.anexos(List.of("contrato.pdf"))
				.build());

		contratoHistoricoRepository.saveAndFlush(ContratoHistorico.builder()
				.contrato(contrato)
				.versao(1)
				.alteracoes(Map.of("titulo", "Contrato original"))
				.dataAlteracao(Instant.parse("2026-04-10T10:15:30Z"))
				.motivo("Criação")
				.build());

		contratoHistoricoRepository.saveAndFlush(ContratoHistorico.builder()
				.contrato(contrato)
				.versao(2)
				.alteracoes(Map.of("descricao", "Descricao revisada"))
				.dataAlteracao(Instant.parse("2026-04-15T10:15:30Z"))
				.motivo("Revisão")
				.build());

		List<ContratoHistoricoResponse> historicos = contratoService.listarHistorico(contrato.getId());

		assertThat(historicos).hasSize(2);
		assertThat(historicos.getFirst().contratoId()).isEqualTo(contrato.getId().toString());
		assertThat(historicos.getFirst().versao()).isEqualTo(2);
		assertThat(historicos.getFirst().alteracoes()).containsEntry("descricao", "Descricao revisada");
		assertThat(historicos.getFirst().dataAlteracao()).isEqualTo("2026-04-15T10:15:30Z");
		assertThat(historicos.getFirst().motivo()).isEqualTo("Revisão");
	}

	@Test
	void deveRetornarAtualizadoEmNovoNaRespostaDoUpdate() throws Exception {
		Contrato contrato = contratoRepository.saveAndFlush(Contrato.builder()
				.motorista("Motorista Original")
				.empresa("Empresa Original")
				.dataInicio(LocalDate.of(2026, 4, 1))
				.dataVencimento(LocalDate.of(2026, 5, 1))
				.valor(new BigDecimal("1500.00"))
				.status(StatusContrato.ATIVO)
				.titulo("Contrato original")
				.descricao("Descricao original")
				.anexos(List.of("contrato.pdf"))
				.build());

		Instant atualizadoEmOriginal = contrato.getAtualizadoEm();
		Thread.sleep(20);

		ContratoRequest request = new ContratoRequest(
				"Motorista Atualizado",
				"Empresa Atualizada",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 6, 15),
				new BigDecimal("1750.00"),
				StatusContrato.EXPIRANDO,
				"Contrato atualizado",
				"Descricao atualizada",
				List.of("contrato.pdf", "aditivo.pdf"));

		ContratoResponse response = contratoService.atualizar(contrato.getId(), request);
		Contrato persistido = contratoRepository.findById(contrato.getId()).orElseThrow();

		assertThat(response.atualizadoEm()).isAfter(atualizadoEmOriginal);
		assertThat(persistido.getAtualizadoEm()).isAfter(atualizadoEmOriginal);
		assertThat(response.motorista()).isEqualTo("Motorista Atualizado");
		assertThat(response.status()).isEqualTo(StatusContrato.EXPIRANDO);
	}
}

