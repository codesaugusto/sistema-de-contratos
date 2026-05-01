package com.malloc.backend_contratos.business;

import com.malloc.backend_contratos.business.dto.AuthResponse;
import com.malloc.backend_contratos.business.dto.CadastroRequest;
import com.malloc.backend_contratos.business.dto.LoginRequest;
import com.malloc.backend_contratos.infrastructure.entity.Usuario;
import com.malloc.backend_contratos.infrastructure.repository.UsuarioRepository;
import com.malloc.backend_contratos.infrastructure.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Realiza o login: autentica as credenciais via Spring Security (que usa BCrypt
     * internamente) e retorna o JWT junto com nome e e-mail — exatamente o que o
     * frontend espera em AuthResponse.
     */
    public AuthResponse login(LoginRequest request) {
        // Delega para o AuthenticationManager; lança exceção se credenciais inválidas
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        // Credenciais válidas — busca o usuário para pegar o nome
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow();

        String token = jwtUtil.generateToken(usuario.getEmail());

        return new AuthResponse(token, "Bearer", usuario.getEmail(), usuario.getNome());
    }

    /**
     * Cadastra um novo usuário com a senha codificada via BCrypt.
     * O token é gerado apenas no login.
     */
    @Transactional
    public AuthResponse cadastrar(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado: " + request.email());
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))   // BCrypt aqui
                .build();

        usuarioRepository.save(usuario);

        return new AuthResponse(null, null, usuario.getEmail(), usuario.getNome());
    }
}

