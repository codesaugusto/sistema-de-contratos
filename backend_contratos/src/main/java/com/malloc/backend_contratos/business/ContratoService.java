package com.malloc.backend_contratos.business;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ContratoService {

	private final ContratoRepository contratoRepository;
	private final ContratoHistoricoRepository contratoHistoricoRepository;
	private final NotificacaoContratoRepository notificacaoContratoRepository;
	private final ContratoConverter contratoConverter;
	private final ContratoHistoricoConverter contratoHistoricoConverter;

	@Transactional(readOnly = true)
	public Page<ContratoResponse> listarTodos(Pageable pageable) {
		return contratoRepository.findAll(pageable)
				.map(contratoConverter::paraContratoResponse);
	}

	@Transactional(readOnly = true)
	public ContratoResponse buscarPorId(UUID id) {
		return contratoConverter.paraContratoResponse(buscarEntidade(id));
	}

	@Transactional(readOnly = true)
	public List<ContratoHistoricoResponse> listarHistorico(UUID id) {
		buscarEntidade(id);
		return contratoHistoricoRepository.findHistoricosByContratoId(id).stream()
				.map(contratoHistoricoConverter::paraContratoHistoricoResponse)
				.toList();
	}

	@Transactional
	public ContratoResponse criar(ContratoRequest request) {
		Contrato contrato = contratoConverter.paraContrato(request);
		Contrato salvo = contratoRepository.save(contrato);
		registrarHistoricoCriacao(salvo);
		registrarNotificacaoEventoContrato(salvo, TipoNotificacao.AVISO, "Contrato criado com sucesso.", 0);
		return contratoConverter.paraContratoResponse(salvo);
	}

	@Transactional
	public ContratoResponse atualizar(UUID id, ContratoRequest request) {
		Contrato contrato = buscarEntidade(id);
		Map<String, String> estadoAnterior = extrairSnapshot(contrato);
		contratoConverter.atualizarContrato(request, contrato);
		Contrato atualizado = contratoRepository.saveAndFlush(contrato);

		// Detecta alterações e registra histórico
		Map<String, String> alteracoes = registrarHistoricoAtualizacao(atualizado, estadoAnterior);
		
		// Só cria notificação de RENOVACAO se houve mudanças significativas
		if (!alteracoes.isEmpty()) {
			registrarNotificacaoEventoContrato(atualizado, TipoNotificacao.RENOVACAO, "Contrato atualizado.", 0);
		}

		return contratoConverter.paraContratoResponse(atualizado);
	}

	@Transactional
	public void deletar(UUID id) {
		Contrato contrato = buscarEntidade(id);
		UUID contratoId = contrato.getId();
		String tituloContrato = contrato.getTitulo();

		// 1. Remover ElementCollection (contrato_historico_alteracoes) antes do histórico
		contratoHistoricoRepository.deleteAlteracoesByContratoId(id);
		// 2. Remover os registros de histórico
		contratoHistoricoRepository.deleteHistoricosByContratoId(id);
		// 3. Remover notificações vinculadas
		notificacaoContratoRepository.deleteByContratoId(id);
		// 4. Remover o contrato (Hibernate apaga contrato_anexos automaticamente)
		contratoRepository.delete(contrato);

		// 5. Registrar notificação de exclusão (sem FK para o contrato deletado)
		registrarNotificacaoExclusao(contratoId, tituloContrato);
	}

	@Scheduled(cron = "0 0 8 * * *")
	@Transactional
	public void gerarNotificacoesVencimento() {
		List<Contrato> contratos = contratoRepository.findAll();
		LocalDate hoje = LocalDate.now();

		for (Contrato contrato : contratos) {
			if (contrato.getDataVencimento() == null || contrato.getStatus() == StatusContrato.VENCIDO) {
				continue;
			}

			long diasRestantes = ChronoUnit.DAYS.between(hoje, contrato.getDataVencimento());
			if (!deveNotificarVencimento(diasRestantes)) {
				continue;
			}

			int diasAntecedencia = (int) diasRestantes;
			if (jaExisteNotificacaoDeVencimentoNoDia(contrato.getId(), diasAntecedencia)) {
				continue;
			}

			String mensagem = "Contrato vence em " + diasAntecedencia + " dia" + (diasAntecedencia == 1 ? "" : "s") + ".";
			registrarNotificacaoEventoContrato(contrato, TipoNotificacao.VENCIMENTO, mensagem, diasAntecedencia);
		}
	}

	@Transactional(readOnly = true)
	public DashboardStats obterDashboard() {
		List<Contrato> contratos = contratoRepository.findAll();

		long contratosAtivos = contarPorStatus(contratos, StatusContrato.ATIVO);
		long contratosVencidos = contarPorStatus(contratos, StatusContrato.VENCIDO);
		long contratosExpirando = contarPorStatus(contratos, StatusContrato.EXPIRANDO);

		BigDecimal valorTotal = contratos.stream()
				.map(Contrato::getValor)
				.filter(Objects::nonNull)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		List<Contrato> proximosVencimentos = contratos.stream()
				.filter(contrato -> contrato.getDataVencimento() != null)
				.filter(contrato -> contrato.getStatus() != StatusContrato.VENCIDO)
				.sorted(Comparator.comparing(Contrato::getDataVencimento))
				.limit(5)
				.toList();

		long alertasNaoLidos = notificacaoContratoRepository.countByLidaFalse();

		return new DashboardStats(
				contratos.size(),
				contratosAtivos,
				contratosVencidos,
				contratosExpirando,
				valorTotal,
				proximosVencimentos.stream().map(contratoConverter::paraContratoResumoResponse).toList(),
				alertasNaoLidos);
	}

	private Contrato buscarEntidade(UUID id) {
		return contratoRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Contrato não encontrado."));
	}

	private long contarPorStatus(List<Contrato> contratos, StatusContrato status) {
		return contratos.stream()
				.filter(contrato -> contrato.getStatus() == status)
				.count();
	}

	private void registrarHistoricoCriacao(Contrato contrato) {
		salvarHistorico(contrato, "Criação do contrato", extrairSnapshot(contrato));
	}

	private Map<String, String> registrarHistoricoAtualizacao(Contrato contrato, Map<String, String> estadoAnterior) {
		Map<String, String> estadoAtual = extrairSnapshot(contrato);
		Map<String, String> alteracoes = new LinkedHashMap<>();
		estadoAtual.forEach((campo, valorAtual) -> {
			if (!Objects.equals(estadoAnterior.get(campo), valorAtual)) {
				alteracoes.put(campo, valorAtual);
			}
		});

		if (!alteracoes.isEmpty()) {
			salvarHistorico(contrato, "Atualização do contrato", alteracoes);
		}
		
		return alteracoes;
	}

	private void salvarHistorico(Contrato contrato, String motivo, Map<String, String> alteracoes) {
		ContratoHistorico historico = ContratoHistorico.builder()
				.contrato(contrato)
				.versao(proximaVersao(contrato.getId()))
				.alteracoes(new LinkedHashMap<>(alteracoes))
				.motivo(motivo)
				.build();
		contratoHistoricoRepository.save(historico);
	}

	private int proximaVersao(UUID contratoId) {
		return contratoHistoricoRepository.findFirstByContratoIdOrderByVersaoDesc(contratoId)
				.map(ultimo -> ultimo.getVersao() + 1)
				.orElse(1);
	}

	private Map<String, String> extrairSnapshot(Contrato contrato) {
		Map<String, String> snapshot = new LinkedHashMap<>();
		adicionarCampo(snapshot, "titulo", contrato.getTitulo());
		adicionarCampo(snapshot, "descricao", contrato.getDescricao());
		adicionarCampo(snapshot, "motorista", contrato.getMotorista());
		adicionarCampo(snapshot, "empresa", contrato.getEmpresa());
		adicionarCampo(snapshot, "dataInicio", contrato.getDataInicio());
		adicionarCampo(snapshot, "dataVencimento", contrato.getDataVencimento());
		adicionarCampo(snapshot, "valor", contrato.getValor());
		adicionarCampo(snapshot, "status", contrato.getStatus() == null ? null : contrato.getStatus().getValor());
		adicionarCampo(snapshot, "anexos", contrato.getAnexos() == null ? null : String.join(",", contrato.getAnexos()));
		return snapshot;
	}

	private void adicionarCampo(Map<String, String> snapshot, String campo, Object valor) {
		if (valor != null) {
			snapshot.put(campo, valor.toString());
		}
	}

	private void registrarNotificacaoEventoContrato(Contrato contrato, TipoNotificacao tipo, String mensagem,
			Integer diasAntecedencia) {
		NotificacaoContrato notificacao = NotificacaoContrato.builder()
				.contrato(contrato)
				.contratoIdSnapshot(contrato.getId())
				.tituloContratoSnapshot(contrato.getTitulo())
				.tipo(tipo)
				.mensagem(mensagem)
				.lida(Boolean.FALSE)
				.diasAntecedencia(diasAntecedencia)
				.build();
		notificacaoContratoRepository.save(notificacao);
	}

	private void registrarNotificacaoExclusao(UUID contratoId, String tituloContrato) {
		NotificacaoContrato notificacao = NotificacaoContrato.builder()
				.contratoIdSnapshot(contratoId)
				.tituloContratoSnapshot(tituloContrato)
				.tipo(TipoNotificacao.AVISO)
				.mensagem("Contrato excluído.")
				.lida(Boolean.FALSE)
				.diasAntecedencia(0)
				.build();
		notificacaoContratoRepository.save(notificacao);
	}

	private boolean deveNotificarVencimento(long diasRestantes) {
		return diasRestantes == 30 || diasRestantes == 15 || diasRestantes == 7 || diasRestantes == 1;
	}

	private boolean jaExisteNotificacaoDeVencimentoNoDia(UUID contratoId, int diasAntecedencia) {
		Instant inicioDia = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);
		Instant fimDia = LocalDate.now().plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC).minusNanos(1);
		return notificacaoContratoRepository.existsByContratoIdAndTipoAndDiasAntecedenciaAndDataNotificacaoBetween(
				contratoId,
				TipoNotificacao.VENCIMENTO,
				diasAntecedencia,
				inicioDia,
				fimDia);
	}
}
