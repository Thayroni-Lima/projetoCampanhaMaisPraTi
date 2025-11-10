package com.projeto.campanhas.backend.api.dto.campaign;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class CampaignUpdateRequest {
    // Remover @DecimalMin e @Digits, ou torná-los opcionais
    // A validação será feita apenas se o valor for fornecido
    @DecimalMin(value = "0.01", message = "O valor da meta deve ser maior que 0.01")
    @Digits(integer = 8, fraction = 2, message = "O valor da meta deve ter no máximo 8 dígitos inteiros e 2 casas decimais")
    private BigDecimal goal;

    private Instant deadline;

    @Size(max = 50, message = "O título deve ter no máximo 50 caracteres")
    private String title;

    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
    private String description;

    @Size(max = 120, message = "O preview deve ter no máximo 120 caracteres")
    private String preview;

    @Size(max = 50, message = "A categoria deve ter no máximo 50 caracteres")
    private String category;

    @Size(max = 50, message = "A cidade deve ter no máximo 50 caracteres")
    private String city;

    @Size(max = 20, message = "O estado deve ter no máximo 20 caracteres")
    private String state;

    @Size(max = 255, message = "A URL da imagem deve ter no máximo 255 caracteres")
    private String imageUrl;
}