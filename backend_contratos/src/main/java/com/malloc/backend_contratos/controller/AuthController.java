package com.malloc.backend_contratos.controller;

import com.malloc.backend_contratos.business.UsuarioService;
import com.malloc.backend_contratos.business.dto.AuthResponse;
import com.malloc.backend_contratos.business.dto.CadastroRequest;
import com.malloc.backend_contratos.business.dto.LoginRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    /**
     * POST /auth/login
     * Recebe { email, senha } e retorna { token, tipo, email, nome }
     * — exatamente o que o frontend espera em AuthResponse (auth.ts).
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = usuarioService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /auth/register
     * Cadastra um novo usuário (senha é codificada com BCrypt).
     * Retorna token JWT para autenticação imediata após o cadastro.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody CadastroRequest request) {
        AuthResponse response = usuarioService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

