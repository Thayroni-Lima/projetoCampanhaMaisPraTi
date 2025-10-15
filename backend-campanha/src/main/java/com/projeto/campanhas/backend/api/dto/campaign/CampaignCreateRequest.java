package com.projeto.campanhas.backend.api.dto.campaign;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class CampaignCreateRequest {
    @NotNull
    @DecimalMin(value = "0.01")
    @Digits(integer = 8, fraction = 2)
    private BigDecimal goal;

    @NotNull
    private Instant deadline; // ISO 8601 string in JSON

    @NotBlank
    @Size(max = 50)
    private String title;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @NotBlank
    @Size(max = 120)
    private String preview;

    @NotBlank
    @Size(max = 50)
    private String category;

    @NotBlank
    @Size(max = 50)
    private String city;

    @NotBlank
    @Size(max = 20)
    private String state;

    @Size(max = 255)
    private String imageUrl;
}
