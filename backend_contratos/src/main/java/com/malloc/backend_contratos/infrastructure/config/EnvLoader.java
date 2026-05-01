package com.malloc.backend_contratos.infrastructure.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * Carrega .env ANTES do Spring inicializar o context.
 * Precedência respeitada:
 * 1. Variáveis de ambiente do OS/Docker (nunca sobrescritas)
 * 2. .env (este initializer — usado apenas para dev local)
 * 3. application.properties (defaults)
 */
public class EnvLoader implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        loadEnvVars(context.getEnvironment());
    }

    private void loadEnvVars(ConfigurableEnvironment env) {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            // Injeta como System properties APENAS se a variável não existir
            // no ambiente do OS/Docker, garantindo que Docker env vars tenham precedência.
            dotenv.entries().forEach(entry -> {
                if (System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });

            System.out.println("[EnvLoader] ✅ .env carregado com sucesso");

        } catch (Exception ex) {
            System.err.println("[EnvLoader] ⚠️ Aviso: .env não encontrado ou erro ao carregar: " + ex.getMessage());
        }
    }
}

