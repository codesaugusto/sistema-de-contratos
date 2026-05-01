package com.malloc.backend_contratos.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Component
@Validated
@Getter
@Setter
@ConfigurationProperties(prefix = "required-env")
public class RequiredEnvironmentProperties {

    @NotBlank
    private String dbUrl;

    @NotBlank
    private String dbUsername;

    @NotBlank
    private String dbPassword;

    @NotBlank
    private String jwtSecret;
}
