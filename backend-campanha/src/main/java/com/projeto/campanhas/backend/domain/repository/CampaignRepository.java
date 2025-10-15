package com.projeto.campanhas.backend.domain.repository;

import com.projeto.campanhas.backend.domain.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, String> {
    List<Campaign> findByUserId(String userId);
}
