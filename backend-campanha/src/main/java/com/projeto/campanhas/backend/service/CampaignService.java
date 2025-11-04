package com.projeto.campanhas.backend.service;

import com.projeto.campanhas.backend.api.dto.campaign.CampaignCreateRequest;
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
}
