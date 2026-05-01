package com.malloc.backend_contratos.infrastructure.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notificacoes")
public class NotificacaoContrato {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "contrato_id", nullable = true)
	private Contrato contrato;

	@Column(nullable = false, updatable = false)
	private UUID contratoIdSnapshot;

	@Column(nullable = false, length = 2000)
	private String tituloContratoSnapshot;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private TipoNotificacao tipo;

	@Column(nullable = false, length = 500)
	private String mensagem;

	@Column(nullable = false)
	private Boolean lida;

	@Column(nullable = false)
	private Instant dataNotificacao;

	@Default
	@Column(nullable = false)
	private Integer diasAntecedencia = 0;

	@PrePersist
	void prePersist() {
		if (lida == null) {
			lida = Boolean.FALSE;
		}

		if (dataNotificacao == null) {
			dataNotificacao = Instant.now();
		}
		
		if (diasAntecedencia == null) {
			diasAntecedencia = 0;
		}

		if (contrato != null) {
			if (contratoIdSnapshot == null) {
				contratoIdSnapshot = contrato.getId();
			}
			if (tituloContratoSnapshot == null) {
				tituloContratoSnapshot = contrato.getTitulo();
			}
		}
	}
}

