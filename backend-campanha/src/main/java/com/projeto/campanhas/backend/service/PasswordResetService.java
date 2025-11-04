package com.projeto.campanhas.backend.service;

import com.projeto.campanhas.backend.domain.entity.PasswordResetToken;
import com.projeto.campanhas.backend.domain.entity.User;

import com.projeto.campanhas.backend.domain.repository.PasswordResetTokenRepository;
import com.projeto.campanhas.backend.domain.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // 1️⃣ Gerar token e enviar e-mail
    public void initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado com esse e-mail.");
        }

        User user = userOpt.get();
        tokenRepository.deleteByUser(user); // remove tokens antigos

        String token = UUID.randomUUID().toString();
        Instant expiration = Instant.now().plusSeconds(60 * 60); // 1 hora
        PasswordResetToken resetToken = new PasswordResetToken(token, expiration, user);
        tokenRepository.save(resetToken);

        String link = "http://localhost:5173/reset-password?token=" + token;
        String message = "Olá " + user.getName() + ",\n\n" +
                "Clique no link abaixo para redefinir sua senha:\n" + link +
                "\n\nO link expira em 1 hora.";

        emailService.sendEmail(user.getEmail(), "Recuperação de Senha", message);
    }

    // 2️⃣ Validar token
    public boolean validateToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        return tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(Instant.now());
    }

    // 3️⃣ Redefinir senha
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Token inválido.");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiration().isBefore(Instant.now())) {
            throw new RuntimeException("Token expirado.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken); // invalida o token
    }
}
