package com.malloc.backend_contratos.business;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.malloc.backend_contratos.business.converter.NotificacaoConverter;
import com.malloc.backend_contratos.business.dto.NotificacaoResponse;
import com.malloc.backend_contratos.infrastructure.repository.NotificacaoContratoRepository;

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

	private final NotificacaoContratoRepository notificacaoContratoRepository;
	private final NotificacaoConverter notificacaoConverter;

	@Transactional(readOnly = true)
	public List<NotificacaoResponse> listar() {
		return notificacaoContratoRepository.findAllOrdenadas().stream()
				.map(notificacaoConverter::paraNotificacaoResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<NotificacaoResponse> listarNaoLidas() {
		return notificacaoContratoRepository.findNaoLidasOrdenadas().stream()
				.map(notificacaoConverter::paraNotificacaoResponse)
				.toList();
	}

	@Transactional
	public void marcarComoLida(UUID id) {
		int atualizadas = notificacaoContratoRepository.marcarComoLida(id);
		if (atualizadas == 0 && !notificacaoContratoRepository.existsById(id)) {
			throw new ResponseStatusException(NOT_FOUND, "Notificação não encontrada.");
		}
	}

	@Transactional
	public void marcarTodasComoLidas() {
		notificacaoContratoRepository.marcarTodasComoLidas();
	}

	@Transactional
	public void marcarComoNaoLida(UUID id) {
		int atualizadas = notificacaoContratoRepository.marcarComoNaoLida(id);
		if (atualizadas == 0 && !notificacaoContratoRepository.existsById(id)) {
			throw new ResponseStatusException(NOT_FOUND, "Notificação não encontrada.");
		}
	}
}

