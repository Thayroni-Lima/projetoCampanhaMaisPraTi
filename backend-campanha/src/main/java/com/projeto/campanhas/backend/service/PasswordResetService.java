package com.projeto.campanhas.backend.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projeto.campanhas.backend.api.exception.TokenExpiredException;
import com.projeto.campanhas.backend.api.exception.TokenInvalidException;
import com.projeto.campanhas.backend.domain.entity.PasswordResetToken;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.domain.repository.PasswordResetTokenRepository;
import com.projeto.campanhas.backend.domain.repository.UserRepository;

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
    // IMPORTANTE: Sempre retorna sucesso para não revelar se o email existe (segurança)
    @Transactional
    public void initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email.toLowerCase());
        
        // Se o usuário existe, gera token e envia email
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            tokenRepository.deleteByUser(user); // remove tokens antigos

            String token = UUID.randomUUID().toString();
            Instant expiration = Instant.now().plusSeconds(60 * 60); // 1 hora
            PasswordResetToken resetToken = new PasswordResetToken(token, expiration, user);
            tokenRepository.save(resetToken);

            String link = "http://localhost:3000/reset-password?token=" + token;
            String message = "Olá " + user.getName() + ",\n\n" +
                    "Clique no link abaixo para redefinir sua senha:\n" + link +
                    "\n\nO link expira em 1 hora.\n\n" +
                    "Se você não solicitou esta recuperação, ignore este e-mail.";
            
            emailService.sendEmail(user.getEmail(), "Recuperação de Senha", message);
        }
        // Se o usuário não existe, não faz nada (não revela que o email não está cadastrado)
    }

    // 2️⃣ Validar token
    public boolean validateToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        return tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(Instant.now());
    }

    // 3️⃣ Redefinir senha
    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            throw new TokenInvalidException("Token inválido ou não encontrado.");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiration().isBefore(Instant.now())) {
            tokenRepository.delete(resetToken); // remove token expirado
            throw new TokenExpiredException("Token expirado. Solicite um novo link de recuperação.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken); // invalida o token após uso
    }
}
