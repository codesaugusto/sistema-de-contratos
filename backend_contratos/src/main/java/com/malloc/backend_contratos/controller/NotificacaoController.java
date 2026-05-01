package com.malloc.backend_contratos.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.malloc.backend_contratos.business.NotificacaoService;
import com.malloc.backend_contratos.business.dto.NotificacaoResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

	private final NotificacaoService notificacaoService;

	@GetMapping
	public List<NotificacaoResponse> listar() {
		return notificacaoService.listar();
	}

	@GetMapping("/nao-lidas")
	public List<NotificacaoResponse> listarNaoLidas() {
		return notificacaoService.listarNaoLidas();
	}

	@PatchMapping("/{id}/lida")
	public ResponseEntity<Void> marcarComoLida(@PathVariable UUID id) {
		notificacaoService.marcarComoLida(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/marcar-todas-lidas")
	public ResponseEntity<Void> marcarTodasComoLidas() {
		notificacaoService.marcarTodasComoLidas();
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/nao-lida")
	public ResponseEntity<Void> marcarComoNaoLida(@PathVariable UUID id) {
		notificacaoService.marcarComoNaoLida(id);
		return ResponseEntity.noContent().build();
	}
}

