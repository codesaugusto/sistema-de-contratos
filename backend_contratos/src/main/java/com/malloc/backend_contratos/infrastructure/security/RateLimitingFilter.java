package com.malloc.backend_contratos.infrastructure.security;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Rate limiting por IP:
 *  - /auth/**  → 15 requisições por minuto  (proteção contra brute-force)
 *  - demais    → 100 requisições por minuto
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // --- limites configuráveis ---
    private static final int AUTH_CAPACITY   = 15;
    private static final int AUTH_REFILL     = 15;

    private static final int API_CAPACITY    = 100;
    private static final int API_REFILL      = 100;

    // -------------------------------------------------------

    private Bucket createBucket(boolean isAuthEndpoint) {
        Bandwidth limit = isAuthEndpoint
                ? Bandwidth.builder().capacity(AUTH_CAPACITY).refillGreedy(AUTH_REFILL, Duration.ofMinutes(1)).build()
                : Bandwidth.builder().capacity(API_CAPACITY).refillGreedy(API_REFILL, Duration.ofMinutes(1)).build();
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // CORS preflight requests should never be rate limited
        // They must pass through to allow actual requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip            = resolveClientIp(request);
        boolean isAuthRoute  = request.getRequestURI().startsWith("/auth/");
        String bucketKey     = (isAuthRoute ? "auth:" : "api:") + ip;

        Bucket bucket = buckets.computeIfAbsent(bucketKey, k -> createBucket(isAuthRoute));

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"status\":429,\"erro\":\"Limite de requisições excedido. Tente novamente em breve.\"}"
            );
        }
    }

    /**
     * Lê o IP real mesmo atrás de proxy/load-balancer.
     * Nunca loga o IP internamente para evitar exposure em logs.
     */
    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // X-Forwarded-For pode ser: "client, proxy1, proxy2"
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}

