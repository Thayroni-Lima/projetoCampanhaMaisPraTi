package com.projeto.campanhas.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    public static final String BEARER_KEY = "bearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mais Pra Ti API")
                        .description("API para cadastro de usuários, autenticação JWT e gestão de campanhas")
                        .version("v1"))
                .components(new Components().addSecuritySchemes(BEARER_KEY, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
                // Add a security item so the Authorize button appears in Swagger UI
                .addSecurityItem(new SecurityRequirement().addList(BEARER_KEY));
    }
}
