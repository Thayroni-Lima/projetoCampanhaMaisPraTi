package com.projeto.campanhas.backend.api.controller;

import com.projeto.campanhas.backend.api.dto.campaign.CampaignCreateRequest;
import com.projeto.campanhas.backend.api.dto.campaign.CampaignResponse;
import com.projeto.campanhas.backend.api.dto.campaign.CampaignUpdateRequest;
import com.projeto.campanhas.backend.domain.entity.Campaign;
import com.projeto.campanhas.backend.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    private static CampaignResponse toResponse(Campaign c) {
        return new CampaignResponse(
                c.getId(), c.getGoal(), c.getDeadline(), c.getTitle(), c.getDescription(), 
                c.getPreview(), c.getCategory(), c.getCity(), c.getState(), c.getImageUrl(), c.getUserId(), c.getDonationsCount()
        );
    }

    @Operation(summary = "Criar campanha")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<CampaignResponse> create(@Valid @RequestBody CampaignCreateRequest request) {
        Campaign c = campaignService.create(request);
        return ResponseEntity.ok(toResponse(c));
    }

    @Operation(summary = "Listar campanhas")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<CampaignResponse>> listAll(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "excludeMine", required = false, defaultValue = "false") boolean excludeMine
    ) {
        List<CampaignResponse> list = campaignService.listFiltered(title, category, excludeMine).stream()
                .map(CampaignController::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Buscar campanha por ID")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getById(@PathVariable String id) {
        Campaign c = campaignService.getById(id);
        return ResponseEntity.ok(toResponse(c));
    }

    @Operation(summary = "Atualizar campanha")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CampaignUpdateRequest request) {
        Campaign updatedCampaign = campaignService.update(id, request);
        return ResponseEntity.ok(toResponse(updatedCampaign));
    }

    @Operation(summary = "Deletar campanha")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        campaignService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Doar para campanha (incremento simples)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}/donate")
    public ResponseEntity<CampaignResponse> donate(@PathVariable String id) {
        Campaign c = campaignService.donate(id);
        return ResponseEntity.ok(toResponse(c));
    }
}