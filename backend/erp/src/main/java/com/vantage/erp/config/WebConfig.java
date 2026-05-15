package com.vantage.erp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração global de CORS para permitir integração com o frontend React.
 * Em produção, usa a variável de ambiente FRONTEND_URL para restringir origens.
 * Em desenvolvimento, permite todas as origens para facilitar testes.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${FRONTEND_URL:}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        var mapping = registry.addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .maxAge(3600);

        if (frontendUrl != null && !frontendUrl.isBlank()) {
            // Produção: permite apenas a origem do frontend configurado
            mapping.allowedOrigins(frontendUrl).allowCredentials(true);
        } else {
            // Desenvolvimento: permite todas as origens para testes
            mapping.allowedOrigins("*").allowCredentials(false);
        }
    }
}