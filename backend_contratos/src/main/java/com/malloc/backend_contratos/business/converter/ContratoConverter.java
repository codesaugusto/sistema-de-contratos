package com.malloc.backend_contratos.business.converter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.malloc.backend_contratos.business.dto.ContratoRequest;
import com.malloc.backend_contratos.business.dto.ContratoResponse;
import com.malloc.backend_contratos.business.dto.ContratoResumoResponse;
import com.malloc.backend_contratos.infrastructure.entity.Contrato;

@Component
public class ContratoConverter {

	public Contrato paraContrato(ContratoRequest contratoRequest) {
		Contrato contrato = new Contrato();
		atualizarContrato(contratoRequest, contrato);
		return contrato;
	}

	public void atualizarContrato(ContratoRequest contratoRequest, Contrato contrato) {
		contrato.setMotorista(contratoRequest.motorista());
		contrato.setEmpresa(contratoRequest.empresa());
		contrato.setDataInicio(contratoRequest.dataInicio());
		contrato.setDataVencimento(contratoRequest.dataVencimento());
		contrato.setValor(contratoRequest.valor());
		contrato.setStatus(contratoRequest.status());
		contrato.setTitulo(contratoRequest.titulo());
		contrato.setDescricao(contratoRequest.descricao());
		contrato.setAnexos(paraListaAnexos(contratoRequest.anexos()));
	}

	public ContratoResponse paraContratoResponse(Contrato contrato) {
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
				paraListaAnexosResponse(contrato.getAnexos()),
				contrato.getCriadoEm(),
				contrato.getAtualizadoEm());
	}

	public ContratoResumoResponse paraContratoResumoResponse(Contrato contrato) {
		return new ContratoResumoResponse(
				contrato.getId(),
				contrato.getMotorista(),
				contrato.getEmpresa(),
				contrato.getDataVencimento(),
				contrato.getValor(),
				contrato.getStatus());
	}

	public List<String> paraListaAnexos(List<String> anexos) {
		return anexos == null ? new ArrayList<>() : new ArrayList<>(anexos);
	}

	public List<String> paraListaAnexosResponse(List<String> anexos) {
		return anexos == null ? List.of() : List.copyOf(anexos);
	}
}

