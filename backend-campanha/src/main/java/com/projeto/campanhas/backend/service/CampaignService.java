package com.projeto.campanhas.backend.service;

import com.projeto.campanhas.backend.api.dto.campaign.CampaignCreateRequest;
import com.projeto.campanhas.backend.api.dto.campaign.CampaignUpdateRequest;
import com.projeto.campanhas.backend.domain.entity.Campaign;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.domain.repository.CampaignRepository;
import com.projeto.campanhas.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    @SuppressWarnings("null")
    @Transactional
    public Campaign create(CampaignCreateRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        Campaign campaign = Campaign.builder()
                .goal(req.getGoal())
                .deadline(req.getDeadline())
                .title(req.getTitle())
                .description(req.getDescription())
                .preview(req.getPreview())
                .category(req.getCategory())
                .city(req.getCity())
                .state(req.getState())
                .imageUrl(req.getImageUrl())
                .userId(user.getId())
                .build();
        return campaignRepository.save(campaign);
    }

    public List<Campaign> listAll() {
        return campaignRepository.findAll();
    }

    @SuppressWarnings("null")
    public Campaign getById(String id) {
        return campaignRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Campanha não encontrada"));
    }

    /**
     * Atualiza uma campanha existente
     * Apenas o dono da campanha pode atualizá-la
     */
    @SuppressWarnings("null")
    @Transactional
    public Campaign update(String campaignId, CampaignUpdateRequest request) {
        // Buscar a campanha
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("Campanha não encontrada"));

        // Verificar se o usuário logado é o dono da campanha
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        if (!campaign.getUserId().equals(currentUser.getId())) {
            throw new IllegalStateException("Você não tem permissão para editar esta campanha");
        }

        // Atualizar campos opcionais (apenas se fornecidos)
        if (request.getGoal() != null) {
            campaign.setGoal(request.getGoal());
        }

        if (request.getDeadline() != null) {
            campaign.setDeadline(request.getDeadline());
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            campaign.setTitle(request.getTitle());
        }

        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            campaign.setDescription(request.getDescription());
        }

        if (request.getPreview() != null && !request.getPreview().isBlank()) {
            campaign.setPreview(request.getPreview());
        }

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            campaign.setCategory(request.getCategory());
        }

        if (request.getCity() != null && !request.getCity().isBlank()) {
            campaign.setCity(request.getCity());
        }

        if (request.getState() != null && !request.getState().isBlank()) {
            campaign.setState(request.getState());
        }

        if (request.getImageUrl() != null) {
            campaign.setImageUrl(request.getImageUrl());
        }

        // O @PreUpdate atualiza o updatedAt automaticamente
        return campaignRepository.save(campaign);
    }

    /**
     * Deleta uma campanha existente
     * Apenas o dono da campanha pode deletá-la
     */
    @SuppressWarnings("null")
    @Transactional
    public void delete(String campaignId) {
        // Buscar a campanha
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("Campanha não encontrada"));

        // Verificar se o usuário logado é o dono da campanha
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        if (!campaign.getUserId().equals(currentUser.getId())) {
            throw new IllegalStateException("Você não tem permissão para deletar esta campanha");
        }

        // Deletar a campanha
        campaignRepository.delete(campaign);
    }
}