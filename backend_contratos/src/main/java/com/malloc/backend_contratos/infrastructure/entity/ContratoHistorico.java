package com.malloc.backend_contratos.infrastructure.entity;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contrato_historico")
public class ContratoHistorico {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "contrato_id", nullable = false)
	private Contrato contrato;

	@Column(nullable = false)
	private Integer versao;

	@ElementCollection
	@CollectionTable(name = "contrato_historico_alteracoes", joinColumns = @JoinColumn(name = "historico_id"))
	@MapKeyColumn(name = "campo", length = 120)
	@Column(name = "valor", nullable = false, length = 2000)
	@Builder.Default
	private Map<String, String> alteracoes = new LinkedHashMap<>();

	@Column(nullable = false)
	private Instant dataAlteracao;

	@Column(nullable = false, length = 500)
	private String motivo;

	@PrePersist
	void prePersist() {
		if (dataAlteracao == null) {
			dataAlteracao = Instant.now();
		}
	}
}

