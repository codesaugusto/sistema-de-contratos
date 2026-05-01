package com.malloc.backend_contratos.business;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;

import com.malloc.backend_contratos.business.converter.ContratoConverter;
import com.malloc.backend_contratos.business.converter.ContratoHistoricoConverter;
import com.malloc.backend_contratos.business.dto.ContratoHistoricoResponse;
import com.malloc.backend_contratos.business.dto.ContratoRequest;
import com.malloc.backend_contratos.business.dto.ContratoResponse;
import com.malloc.backend_contratos.business.dto.DashboardStats;
import com.malloc.backend_contratos.infrastructure.entity.Contrato;
import com.malloc.backend_contratos.infrastructure.entity.ContratoHistorico;
import com.malloc.backend_contratos.infrastructure.entity.NotificacaoContrato;
import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;
import com.malloc.backend_contratos.infrastructure.entity.TipoNotificacao;
import com.malloc.backend_contratos.infrastructure.repository.ContratoHistoricoRepository;
import com.malloc.backend_contratos.infrastructure.repository.ContratoRepository;
import com.malloc.backend_contratos.infrastructure.repository.NotificacaoContratoRepository;

@ExtendWith(MockitoExtension.class)
class ContratoServiceTest {

	@Mock
	private ContratoRepository contratoRepository;

	@Mock
	private ContratoHistoricoRepository contratoHistoricoRepository;

	@Mock
	private NotificacaoContratoRepository notificacaoContratoRepository;

	@Mock
	private ContratoConverter contratoConverter;

	@Mock
	private ContratoHistoricoConverter contratoHistoricoConverter;

	@InjectMocks
	private ContratoService contratoService;

	@Test
	void deveListarTodosConvertendoParaResponse() {
		Contrato contrato = contrato("Motorista A", "Empresa X", LocalDate.of(2026, 5, 10), "1000.00",
				StatusContrato.ATIVO);
		ContratoResponse response = response(contrato);
		PageRequest pageable = PageRequest.of(0, 10);

		when(contratoRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(contrato), pageable, 1));
		when(contratoConverter.paraContratoResponse(contrato)).thenReturn(response);

		Page<ContratoResponse> contratos = contratoService.listarTodos(pageable);

		assertThat(contratos.getContent()).containsExactly(response);
	}

	@Test
	void deveCriarContratoConvertendoRequestEEntidade() {
		ContratoRequest request = request(StatusContrato.ATIVO);
		Contrato contrato = contrato("Motorista A", "Empresa X", LocalDate.of(2026, 5, 1), "2500.75",
				StatusContrato.ATIVO);
		ContratoResponse response = response(contrato);

		when(contratoConverter.paraContrato(request)).thenReturn(contrato);
		when(contratoRepository.save(contrato)).thenReturn(contrato);
		when(contratoHistoricoRepository.findFirstByContratoIdOrderByVersaoDesc(contrato.getId()))
				.thenReturn(java.util.Optional.empty());
		when(contratoConverter.paraContratoResponse(contrato)).thenReturn(response);

		ContratoResponse criado = contratoService.criar(request);

		assertThat(criado).isEqualTo(response);
		verify(contratoHistoricoRepository).save(any(ContratoHistorico.class));
		verify(notificacaoContratoRepository).save(any(NotificacaoContrato.class));
	}

	@Test
	void deveAtualizarContratoERegistrarHistoricoQuandoHouverAlteracao() {
		Contrato contrato = contrato("Motorista A", "Empresa X", LocalDate.of(2026, 5, 1), "2500.75",
				StatusContrato.ATIVO);
		ContratoRequest requestAtualizado = new ContratoRequest(
				"Motorista B",
				"Empresa X",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("2500.75"),
				StatusContrato.EXPIRANDO,
				"Contrato de teste",
				"Descricao do contrato de teste",
				List.of("anexo.pdf"));
		Contrato atualizado = contrato("Motorista B", "Empresa X", LocalDate.of(2026, 5, 1), "2500.75",
				StatusContrato.EXPIRANDO);
		atualizado.setId(contrato.getId());
		ContratoResponse response = response(atualizado);

		when(contratoRepository.findById(contrato.getId())).thenReturn(java.util.Optional.of(contrato));
		doAnswer(invocation -> {
			ContratoRequest request = invocation.getArgument(0);
			Contrato entidade = invocation.getArgument(1);
			entidade.setMotorista(request.motorista());
			entidade.setEmpresa(request.empresa());
			entidade.setDataInicio(request.dataInicio());
			entidade.setDataVencimento(request.dataVencimento());
			entidade.setValor(request.valor());
			entidade.setStatus(request.status());
			entidade.setTitulo(request.titulo());
			entidade.setDescricao(request.descricao());
			entidade.setAnexos(request.anexos());
			return null;
		}).when(contratoConverter).atualizarContrato(any(ContratoRequest.class), any(Contrato.class));
		when(contratoRepository.saveAndFlush(any(Contrato.class))).thenReturn(atualizado);
		when(contratoHistoricoRepository.findFirstByContratoIdOrderByVersaoDesc(contrato.getId()))
				.thenReturn(java.util.Optional.of(ContratoHistorico.builder().versao(1).build()));
		when(contratoConverter.paraContratoResponse(any(Contrato.class))).thenReturn(response);

		ContratoResponse resultado = contratoService.atualizar(contrato.getId(), requestAtualizado);

		assertThat(resultado).isEqualTo(response);
		verify(contratoHistoricoRepository).save(any(ContratoHistorico.class));
		verify(notificacaoContratoRepository).save(any(NotificacaoContrato.class));
	}

	@Test
	void deveRemoverHistoricoAntesDeDeletarContrato() {
		Contrato contrato = contrato("Motorista A", "Empresa X", LocalDate.of(2026, 5, 1), "2500.75",
				StatusContrato.ATIVO);

		when(contratoRepository.findById(contrato.getId())).thenReturn(java.util.Optional.of(contrato));

		contratoService.deletar(contrato.getId());

		verify(contratoHistoricoRepository).deleteByContratoId(contrato.getId());
		verify(notificacaoContratoRepository).deleteByContratoId(contrato.getId());
		verify(contratoRepository).delete(contrato);
		verify(notificacaoContratoRepository).save(any(NotificacaoContrato.class));
	}

	@Test
	void deveGerarNotificacaoDeVencimentoComDeduplicacaoNoMesmoDia() {
		Contrato contrato = contrato("Motorista A", "Empresa X", LocalDate.now().plusDays(7), "2500.75", StatusContrato.ATIVO);
		when(contratoRepository.findAll()).thenReturn(List.of(contrato));
		when(notificacaoContratoRepository.existsByContratoIdAndTipoAndDiasAntecedenciaAndDataNotificacaoBetween(
				eq(contrato.getId()),
				eq(TipoNotificacao.VENCIMENTO),
				eq(7),
				any(),
				any())).thenReturn(false);

		contratoService.gerarNotificacoesVencimento();

		verify(notificacaoContratoRepository, times(1)).save(any(NotificacaoContrato.class));
	}

	@Test
	void deveListarHistoricoDoContratoConvertendoParaResponse() {
		Contrato contrato = contrato("Motorista A", "Empresa X", LocalDate.of(2026, 5, 1), "2500.75", StatusContrato.ATIVO);
		ContratoHistorico historico = ContratoHistorico.builder()
				.id(UUID.randomUUID())
				.contrato(contrato)
				.versao(2)
				.alteracoes(Map.of("titulo", "Contrato atualizado"))
				.dataAlteracao(Instant.parse("2026-04-15T10:15:30Z"))
				.motivo("Ajuste contratual")
				.build();
		ContratoHistoricoResponse response = new ContratoHistoricoResponse(
				historico.getId().toString(),
				contrato.getId().toString(),
				historico.getVersao(),
				historico.getAlteracoes(),
				"2026-04-15T10:15:30Z",
				historico.getMotivo());

		when(contratoRepository.findById(contrato.getId())).thenReturn(java.util.Optional.of(contrato));
		when(contratoHistoricoRepository.findHistoricosByContratoId(contrato.getId()))
				.thenReturn(List.of(historico));
		when(contratoHistoricoConverter.paraContratoHistoricoResponse(historico)).thenReturn(response);

		List<ContratoHistoricoResponse> historicos = contratoService.listarHistorico(contrato.getId());

		assertThat(historicos).containsExactly(response);
	}

	@Test
	void deveMontarDashboardComBaseNosContratosENotificacoes() {
		Contrato contratoAtivo = contrato("Motorista A", "Empresa X", LocalDate.of(2026, 5, 10), "1000.00",
				StatusContrato.ATIVO);
		Contrato contratoExpirando = contrato("Motorista B", "Empresa Y", LocalDate.of(2026, 4, 30), "2500.00",
				StatusContrato.EXPIRANDO);
		Contrato contratoVencido = contrato("Motorista C", "Empresa Z", LocalDate.of(2026, 4, 1), "900.00",
				StatusContrato.VENCIDO);

		when(contratoRepository.findAll()).thenReturn(List.of(contratoAtivo, contratoExpirando, contratoVencido));
		when(notificacaoContratoRepository.countByLidaFalse()).thenReturn(2L);
		when(contratoConverter.paraContratoResumoResponse(contratoExpirando)).thenReturn(responseResumo(contratoExpirando));
		when(contratoConverter.paraContratoResumoResponse(contratoAtivo)).thenReturn(responseResumo(contratoAtivo));

		DashboardStats dashboard = contratoService.obterDashboard();

		assertThat(dashboard.totalContratos()).isEqualTo(3);
		assertThat(dashboard.contratosAtivos()).isEqualTo(1);
		assertThat(dashboard.contratosExpirando()).isEqualTo(1);
		assertThat(dashboard.contratosVencidos()).isEqualTo(1);
		assertThat(dashboard.valorTotal()).isEqualByComparingTo("4400.00");
		assertThat(dashboard.alertasNaoLidos()).isEqualTo(2);
		assertThat(dashboard.proximosVencimentos())
				.extracting(item -> item.motorista())
				.containsExactly("Motorista B", "Motorista A");
	}

	@Test
	void deveLancarExcecaoAoBuscarContratoInexistente() {
		UUID id = UUID.randomUUID();
		when(contratoRepository.findById(id)).thenReturn(java.util.Optional.empty());

		assertThatThrownBy(() -> contratoService.buscarPorId(id))
				.isInstanceOf(ResponseStatusException.class)
				.hasMessageContaining("404 NOT_FOUND");
	}

	private ContratoRequest request(StatusContrato status) {
		return new ContratoRequest(
				"Motorista A",
				"Empresa X",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("2500.75"),
				status,
				"Contrato de teste",
				"Descricao do contrato de teste",
				List.of("anexo.pdf"));
	}

	private ContratoResponse response(Contrato contrato) {
		return new ContratoResponse(
				contrato.getId(),
				contrato.getMotorista(),
				contrato.getEmpresa(),
				contrato.getDataInicio(),
				contrato.getDataVencimento(),
				contrato.getValor(),
				contrato.getStatus(),
				contrato.getTitulo(),
				contrato.getDescricao(),
				List.of("anexo.pdf"),
				contrato.getCriadoEm(),
				contrato.getAtualizadoEm());
	}

	private com.malloc.backend_contratos.business.dto.ContratoResumoResponse responseResumo(Contrato contrato) {
		return new com.malloc.backend_contratos.business.dto.ContratoResumoResponse(
				contrato.getId(),
				contrato.getMotorista(),
				contrato.getEmpresa(),
				contrato.getDataVencimento(),
				contrato.getValor(),
				contrato.getStatus());
	}

	private Contrato contrato(String motorista, String empresa, LocalDate dataVencimento, String valor,
			StatusContrato status) {
		return Contrato.builder()
				.id(UUID.randomUUID())
				.motorista(motorista)
				.empresa(empresa)
				.dataInicio(dataVencimento.minusMonths(1))
				.dataVencimento(dataVencimento)
				.valor(new BigDecimal(valor))
				.status(status)
				.titulo("Contrato de teste")
				.descricao("Descricao do contrato de teste")
				.criadoEm(Instant.parse("2026-04-01T00:00:00Z"))
				.atualizadoEm(Instant.parse("2026-04-01T00:00:00Z"))
				.build();
	}
}

