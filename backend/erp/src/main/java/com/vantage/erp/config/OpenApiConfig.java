package com.vantage.erp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do OpenAPI/Swagger para documentação da API.
 * Fornece interface interativa para testar os endpoints em /swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vantageErpOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Vantage ERP API")
                        .description("API RESTful para gerenciamento de produtos e previsão de estoque")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Vantage ERP Team")
                                .email("contact@vantage-erp.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
