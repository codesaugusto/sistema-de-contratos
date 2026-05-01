package com.malloc.backend_contratos.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtUtil {

    private final SecretKey secretKey;

    public JwtUtil(@Value("${app.security.jwt-secret}") String jwtSecret) {
        this.secretKey = buildSecretKey(jwtSecret);
    }

    private SecretKey buildSecretKey(String jwtSecret) {
        try {
            byte[] key = Base64.getDecoder().decode(jwtSecret);
            if (key.length < 32) {
                throw new IllegalStateException("JWT_SECRET deve ter pelo menos 32 bytes apos Base64 decode.");
            }
            return Keys.hmacShaKeyFor(key);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("JWT_SECRET deve estar em Base64 valido.", ex);
        }
    }

    private SecretKey getSecretKey(){
        return secretKey;
    }

    // Gera um token JWT com o nome de usuário e validade de 1 hora
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) // Define o email de usuário como o assunto do token
                .issuedAt(new Date()) // Define a data e hora de emissão do token
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 8)) // 8 horas
                .signWith(getSecretKey()) // Converte a chave secreta em bytes e assina o token com ela
                .compact(); // Constrói o token JWT
    }
    // Extrai as claims do token JWT (informações adicionais do token)
    private Claims extractClaims(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(getSecretKey()) // Define a chave secreta para validar a assinatura do token
                .build()
                .parseSignedClaims(token) // Analisa o token JWT e obtém as claims
                .getPayload();  // Obtém o payload (corpo) do token, que contém as claims
    }

    // Extrai o email do usuário do token JWT
    public String extrairEmailToken(String token) throws JwtException {
        // Obtém o assunto (nome de usuário) das claims do token
        return extractClaims(token).getSubject();
    }

    // Verifica se o token JWT está expirado
    public boolean isTokenExpired(String token) throws JwtException {
        // Compara a data de expiração do token com a data atual
        return extractClaims(token).getExpiration().before(new Date());
    }

    // Valida o token JWT verificando o nome de usuário e se o token não está expirado
    public boolean validateToken(String token, String username) throws JwtException {
        // Extrai o nome de usuário do token
        final String extractedUsername = extrairEmailToken(token);
        // Verifica se o nome de usuário do token corresponde ao fornecido e se o token não está expirado
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
