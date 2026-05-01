package com.malloc.backend_contratos.business.dto;

/**
 * Resposta do login — campos espelhados exatamente com o frontend (auth.ts AuthResponse).
 * { "token": "...", "tipo": "Bearer", "email": "...", "nome": "..." }
 */
public record AuthResponse(
        String token,
        String tipo,
        String email,
        String nome
) {}