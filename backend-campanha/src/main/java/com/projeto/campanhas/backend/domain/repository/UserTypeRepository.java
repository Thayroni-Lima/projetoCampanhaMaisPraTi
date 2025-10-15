package com.projeto.campanhas.backend.domain.repository;

import com.projeto.campanhas.backend.domain.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTypeRepository extends JpaRepository<UserType, String> {
    Optional<UserType> findByLabel(String label);
}
