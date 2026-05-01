package com.malloc.backend_contratos.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.malloc.backend_contratos.business.ContratoService;
import com.malloc.backend_contratos.business.dto.ContratoHistoricoResponse;
import com.malloc.backend_contratos.business.dto.ContratoRequest;
import com.malloc.backend_contratos.business.dto.ContratoResponse;
import com.malloc.backend_contratos.business.dto.DashboardStats;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contratos")
@RequiredArgsConstructor
public class ContratoController {

	private final ContratoService contratoService;

	@GetMapping
	public Page<ContratoResponse> listarTodos(Pageable pageable) {
		return contratoService.listarTodos(pageable);
	}

	@GetMapping("/{id}")
	public ContratoResponse buscarPorId(@PathVariable UUID id) {
		return contratoService.buscarPorId(id);
	}

	@GetMapping("/{id}/historico")
	public List<ContratoHistoricoResponse> listarHistorico(@PathVariable UUID id) {
		return contratoService.listarHistorico(id);
	}

	@GetMapping("/dashboard")
	public DashboardStats obterDashboard() {
		return contratoService.obterDashboard();
	}

	@PostMapping
	public ResponseEntity<ContratoResponse> criar(@Valid @RequestBody ContratoRequest request) {
		ContratoResponse response = contratoService.criar(request);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}")
				.buildAndExpand(response.id())
				.toUri();
		return ResponseEntity.created(location).body(response);
	}

	@PutMapping("/{id}")
	public ContratoResponse atualizar(@PathVariable UUID id, @Valid @RequestBody ContratoRequest request) {
		return contratoService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable UUID id) {
		contratoService.deletar(id);
		return ResponseEntity.noContent().build();
	}
}