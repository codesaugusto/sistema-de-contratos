package com.malloc.backend_contratos.infrastructure.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
@Table(name = "contratos")
public class Contrato {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(nullable = false, updatable = false)
  private UUID id;

  @Column(nullable = false, length = 120)
  private String motorista;

  @Column(nullable = false, length = 120)
  private String empresa;

  @Column(nullable = false)
  private LocalDate dataInicio;

  @Column(nullable = false)
  private LocalDate dataVencimento;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal valor;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20, columnDefinition = "VARCHAR(20)")
  private StatusContrato status;

  @Column(nullable = false, length = 2000)
  private String titulo;

  @Column(nullable = false, length = 2000)
  private String descricao;

  @ElementCollection
  @CollectionTable(name = "contrato_anexos", joinColumns = @JoinColumn(name = "contrato_id"))
  @Column(name = "anexo", nullable = false, length = 1000)
  @Builder.Default
  private List<String> anexos = new ArrayList<>();

  @Column(nullable = false, updatable = false)
  private Instant criadoEm;

  @Column(nullable = false)
  private Instant atualizadoEm;

  @PrePersist
  void prePersist() {
    Instant agora = Instant.now();
    if (criadoEm == null) {
      criadoEm = agora;
    }
    atualizadoEm = agora;
  }

  @PreUpdate
  void preUpdate() {
    atualizadoEm = Instant.now();
  }
}
