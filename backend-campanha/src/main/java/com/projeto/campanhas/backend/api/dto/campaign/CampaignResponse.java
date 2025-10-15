package com.projeto.campanhas.backend.api.dto.campaign;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
public class CampaignResponse {
    private String id;
    private BigDecimal goal;
    private Instant deadline;
    private String title;
    private String description;
    private String preview;
    private String category;
    private String city;
    private String state;
    private String imageUrl;
    private String userId;
}
