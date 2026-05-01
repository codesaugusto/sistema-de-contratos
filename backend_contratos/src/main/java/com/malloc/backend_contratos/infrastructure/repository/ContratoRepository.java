package com.malloc.backend_contratos.infrastructure.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.malloc.backend_contratos.infrastructure.entity.Contrato;

public interface ContratoRepository extends JpaRepository<Contrato, UUID> {
}

