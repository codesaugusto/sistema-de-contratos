package com.malloc.backend_contratos.infrastructure.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.malloc.backend_contratos.infrastructure.exceptions.dto.ErrorResponseDTO;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

// Define a classe JwtRequestFilter, que estende OncePerRequestFilter
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    // Define propriedades para armazenar instâncias de JwtUtil e UserDetailsService
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    // Construtor que inicializa as propriedades com instâncias fornecidas
    public JwtRequestFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // Método chamado uma vez por requisição para processar o filtro
    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {
            // Obtém o valor do header "Authorization" da requisição
            final String authorizationHeader = request.getHeader("Authorization");
            final String requestUri = request.getRequestURI();
            final String method = request.getMethod();

            logger.debug("Request: {} {} - Authorization header: {}", method, requestUri,
                    authorizationHeader != null ? "present" : "missing");

            // Verifica se o cabeçalho existe e começa com "Bearer "
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                // Extrai o token JWT do cabeçalho
                final String token = authorizationHeader.substring(7);
                try {
                    // Extrai o nome de usuário do token JWT
                    final String username = jwtUtil.extrairEmailToken(token);
                    logger.debug("Token found for user: {}", username);

                    // Se o nome de usuário não for nulo e o usuário não estiver autenticado ainda
                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        // Carrega os detalhes do usuário a partir do nome de usuário
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        // Valida o token JWT
                        if (jwtUtil.validateToken(token, username)) {
                            // Cria um objeto de autenticação com as informações do usuário
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            // Define a autenticação no contexto de segurança
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            logger.debug("User {} authenticated successfully", username);
                        } else {
                            logger.warn("Token validation failed for user: {}", username);
                        }
                    }
                } catch (ExpiredJwtException e) {
                    logger.warn("JWT token expired: {}", e.getMessage());
                    handleJwtException(response, request, HttpStatus.UNAUTHORIZED, "Token expirado", "TOKEN_EXPIRED");
                    return;
                } catch (JwtException e) {
                    logger.warn("JWT token invalid: {}", e.getMessage());
                    handleJwtException(response, request, HttpStatus.UNAUTHORIZED, "Token inválido ou malformado", "TOKEN_INVALID");
                    return;
                } catch (Exception e) {
                    logger.error("Error processing JWT token: {}", e.getMessage(), e);
                    handleJwtException(response, request, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao processar token", "TOKEN_PROCESSING_ERROR");
                    return;
                }
            } else {
                logger.debug("No valid Authorization header found. Request will require authentication.");
            }
            // Continua a cadeia de filtros, permitindo que a requisição prossiga
            chain.doFilter(request, response);
        } catch (Exception e) {
            // Log do erro para diagnóstico
            logger.error("Erro no JwtRequestFilter: {}", e.getMessage(), e);
            handleJwtException(response, request, HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno na autenticação", "INTERNAL_ERROR");
        }
    }

    private void handleJwtException(HttpServletResponse response, HttpServletRequest request,
                                     HttpStatus status, String mensagem, String errorDetail) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(buildError(status.value(), mensagem, request.getRequestURI(), errorDetail));
    }

    private String buildError(int status, String mensagem, String path, String error){
        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .timestamp(LocalDateTime.now())
                .message(mensagem)
                .error(error)
                .status(status)
                .path(path)
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        try {
            return objectMapper.writeValueAsString(errorResponseDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}