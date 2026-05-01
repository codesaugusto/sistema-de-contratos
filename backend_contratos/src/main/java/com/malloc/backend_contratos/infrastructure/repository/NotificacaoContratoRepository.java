package com.malloc.backend_contratos.infrastructure.repository;

import java.util.List;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.malloc.backend_contratos.infrastructure.entity.NotificacaoContrato;
import com.malloc.backend_contratos.infrastructure.entity.TipoNotificacao;

public interface NotificacaoContratoRepository extends JpaRepository<NotificacaoContrato, UUID> {

	long countByLidaFalse();

	@Query("""
			SELECT notificacao
			FROM NotificacaoContrato notificacao
			LEFT JOIN FETCH notificacao.contrato contrato
			ORDER BY notificacao.dataNotificacao DESC
			""")
	List<NotificacaoContrato> findAllOrdenadas();

	@Query("""
			SELECT notificacao
			FROM NotificacaoContrato notificacao
			LEFT JOIN FETCH notificacao.contrato contrato
			WHERE notificacao.lida = false
			ORDER BY notificacao.dataNotificacao DESC
			""")
	List<NotificacaoContrato> findNaoLidasOrdenadas();

	long deleteByContratoId(UUID contratoId);

	boolean existsByContratoIdAndTipoAndDiasAntecedenciaAndDataNotificacaoBetween(
			UUID contratoId,
			TipoNotificacao tipo,
			Integer diasAntecedencia,
			Instant inicio,
			Instant fim);

	@Modifying
	@Query("""
			UPDATE NotificacaoContrato notificacao
			SET notificacao.lida = true
			WHERE notificacao.id = :id AND notificacao.lida = false
			""")
	int marcarComoLida(@Param("id") UUID id);

	@Modifying
	@Query("""
			UPDATE NotificacaoContrato notificacao
			SET notificacao.lida = true
			WHERE notificacao.lida = false
			""")
	int marcarTodasComoLidas();

	@Modifying
	@Query("""
			UPDATE NotificacaoContrato notificacao
			SET notificacao.lida = false
			WHERE notificacao.id = :id AND notificacao.lida = true
			""")
	int marcarComoNaoLida(@Param("id") UUID id);

	@Modifying
	@Query("""
			UPDATE NotificacaoContrato notificacao
			SET notificacao.lida = false
			WHERE notificacao.lida = true
			""")
	int marcarTodasComoNaoLidas();
}

