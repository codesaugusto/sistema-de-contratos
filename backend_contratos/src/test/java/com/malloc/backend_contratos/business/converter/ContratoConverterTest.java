package com.malloc.backend_contratos.business.converter;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.malloc.backend_contratos.business.dto.ContratoRequest;
import com.malloc.backend_contratos.business.dto.ContratoResponse;
import com.malloc.backend_contratos.business.dto.ContratoResumoResponse;
import com.malloc.backend_contratos.infrastructure.entity.Contrato;
import com.malloc.backend_contratos.infrastructure.entity.StatusContrato;

class ContratoConverterTest {

	private final ContratoConverter contratoConverter = new ContratoConverter();

	@Test
	void deveConverterRequestParaEntidade() {
		ContratoRequest request = new ContratoRequest(
				"Motorista A",
				"Empresa X",
				LocalDate.of(2026, 4, 1),
				LocalDate.of(2026, 5, 1),
				new BigDecimal("1999.90"),
				StatusContrato.ATIVO,
				"Contrato de transporte",
				"Descricao do contrato de transporte",
				List.of("anexo-1.pdf", "anexo-2.pdf"));
		Contrato contrato = contratoConverter.paraContrato(request);
		assertThat(contrato.getMotorista()).isEqualTo("Motorista A");
		assertThat(contrato.getEmpresa()).isEqualTo("Empresa X");
		assertThat(contrato.getDataInicio()).isEqualTo(LocalDate.of(2026, 4, 1));
		assertThat(contrato.getDataVencimento()).isEqualTo(LocalDate.of(2026, 5, 1));
		assertThat(contrato.getValor()).isEqualByComparingTo("1999.90");
		assertThat(contrato.getStatus()).isEqualTo(StatusContrato.ATIVO);
		assertThat(contrato.getTitulo()).isEqualTo("Contrato de transporte");
		assertThat(contrato.getDescricao()).isEqualTo("Descricao do contrato de transporte");
		assertThat(contrato.getAnexos()).containsExactly("anexo-1.pdf", "anexo-2.pdf");
	}

	@Test
	void deveConverterEntidadeParaResponseEResumo() {
		Contrato contrato = Contrato.builder()
				.id(UUID.fromString("f8b9b3ba-8e9e-4d69-a0dc-c001457fc377"))
				.motorista("Motorista B")
				.empresa("Empresa Y")
				.dataInicio(LocalDate.of(2026, 4, 10))
				.dataVencimento(LocalDate.of(2026, 6, 10))
				.valor(new BigDecimal("3200.00"))
				.status(StatusContrato.EXPIRANDO)
				.titulo("Contrato renovável")
				.descricao("Descricao renovavel")
				.anexos(List.of("anexo.pdf"))
				.criadoEm(Instant.parse("2026-04-01T10:15:30Z"))
				.atualizadoEm(Instant.parse("2026-04-15T10:15:30Z"))
				.build();
		ContratoResponse response = contratoConverter.paraContratoResponse(contrato);
		ContratoResumoResponse resumo = contratoConverter.paraContratoResumoResponse(contrato);
		assertThat(response.id()).isEqualTo(contrato.getId());
		assertThat(response.motorista()).isEqualTo("Motorista B");
		assertThat(response.descricao()).isEqualTo("Descricao renovavel");
		assertThat(response.anexos()).containsExactly("anexo.pdf");
		assertThat(response.criadoEm()).isEqualTo(Instant.parse("2026-04-01T10:15:30Z"));
		assertThat(resumo.id()).isEqualTo(contrato.getId());
		assertThat(resumo.empresa()).isEqualTo("Empresa Y");
		assertThat(resumo.status()).isEqualTo(StatusContrato.EXPIRANDO);
	}
}

