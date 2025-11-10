package com.projeto.campanhas.backend.service;

import com.projeto.campanhas.backend.api.dto.user.UserUpdateRequest;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.domain.repository.CampaignRepository;
import com.projeto.campanhas.backend.domain.repository.PasswordResetTokenRepository;
import com.projeto.campanhas.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CampaignRepository campaignRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    /**
     * Atualiza os dados do usuário logado
     */
    @SuppressWarnings("null")
    @Transactional
    public User updateCurrentUser(UserUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        // Atualizar campos opcionais (apenas se fornecidos)
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().toLowerCase();
            // Verificar se o email já está em uso por outro usuário
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email já está em uso");
            }
            user.setEmail(newEmail);
        }
        
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        
        if (request.getCity() != null && !request.getCity().isBlank()) {
            user.setCity(request.getCity());
        }
        
        if (request.getState() != null && !request.getState().isBlank()) {
            user.setState(request.getState().toUpperCase());
        }

        // Atualizar senha (se fornecida)
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("Senha atual é obrigatória para alterar a senha");
            }
            // Verificar senha atual
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Senha atual incorreta");
            }
            // Atualizar senha
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        // O @PreUpdate atualiza o updatedAt automaticamente
        return userRepository.save(user);
    }

    /**
     * Busca o usuário logado
     */
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));
    }

    /**
     * Deleta o usuário logado
     * Um usuário só pode deletar a si mesmo
     */
    @Transactional
    public void deleteCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        // Deletar todas as campanhas do usuário
        campaignRepository.findByUserId(user.getId()).forEach(campaignRepository::delete);

        // Deletar todos os tokens de reset de senha do usuário
        passwordResetTokenRepository.deleteByUser(user);

        // Deletar o usuário
        userRepository.delete(user);
    }
}