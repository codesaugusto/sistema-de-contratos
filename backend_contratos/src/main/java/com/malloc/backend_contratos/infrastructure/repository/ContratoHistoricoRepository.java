package com.malloc.backend_contratos.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.malloc.backend_contratos.infrastructure.entity.ContratoHistorico;

public interface ContratoHistoricoRepository extends JpaRepository<ContratoHistorico, UUID> {
        @Query("""
                        SELECT historico
                        FROM ContratoHistorico historico
                        JOIN FETCH historico.contrato contrato
                        WHERE contrato.id = :contratoId
                        ORDER BY historico.versao DESC, historico.dataAlteracao DESC
                        """)
        List<ContratoHistorico> findHistoricosByContratoId(@Param("contratoId") UUID contratoId);

        Optional<ContratoHistorico> findFirstByContratoIdOrderByVersaoDesc(UUID contratoId);

        /** Passo 1: apagar as alterações (ElementCollection) antes de apagar os históricos */
        @Modifying
        @Query(value = """
                DELETE FROM contrato_historico_alteracoes
                WHERE historico_id IN (
                    SELECT id FROM contrato_historico WHERE contrato_id = :contratoId
                )
                """, nativeQuery = true)
        void deleteAlteracoesByContratoId(@Param("contratoId") UUID contratoId);

        /** Passo 2: apagar os registros de histórico */
        @Modifying
        @Query("DELETE FROM ContratoHistorico h WHERE h.contrato.id = :contratoId")
        void deleteHistoricosByContratoId(@Param("contratoId") UUID contratoId);

}

