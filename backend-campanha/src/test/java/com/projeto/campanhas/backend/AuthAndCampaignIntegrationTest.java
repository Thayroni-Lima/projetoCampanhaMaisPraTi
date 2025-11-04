package com.projeto.campanhas.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthAndCampaignIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @SuppressWarnings("null")
@Test
    void register_login_create_campaign_flow() throws Exception {
        String registerPayload = """
                {
                  "name": "Joao Silva",
                  "email": "joao@example.com",
                  "password": "senha123",
                  "city": "Porto Alegre",
                  "state": "RS"
                }
                """;
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerPayload))
                .andExpect(status().isOk());

        String loginPayload = """
                {
                  "email": "joao@example.com",
                  "password": "senha123"
                }
                """;
        MvcResult res = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        String json = res.getResponse().getContentAsString(StandardCharsets.UTF_8);
        JsonNode node = objectMapper.readTree(json);
        String token = node.get("token").asText();
        assertThat(token).isNotBlank();

        String campaignPayload = """
                {
                  "goal": 1000.00,
                  "deadline": "2030-12-31T00:00:00Z",
                  "title": "Ajude a ONG",
                  "description": "Campanha para ajudar a ONG local",
                  "preview": "Apoie nossa causa",
                  "category": "SOCIAL",
                  "city": "Porto Alegre",
                  "state": "RS",
                  "imageUrl": null
                }
                """;

        mockMvc.perform(post("/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(campaignPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Ajude a ONG"));
    }
}
