package com.projeto.campanhas.backend.service;

import com.projeto.campanhas.backend.api.dto.auth.LoginRequest;
import com.projeto.campanhas.backend.api.dto.auth.RegisterRequest;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.domain.entity.UserType;
import com.projeto.campanhas.backend.domain.repository.UserRepository;
import com.projeto.campanhas.backend.domain.repository.UserTypeRepository;
import com.projeto.campanhas.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @SuppressWarnings("null")
    @Transactional
    public User register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        String label = (req.getUserTypeLabel() == null || req.getUserTypeLabel().isBlank()) ? "NORMAL" : req.getUserTypeLabel().toUpperCase();
        UserType userType = userTypeRepository.findByLabel(label)
                .orElseThrow(() -> new IllegalStateException("Tipo de usuário não encontrado: " + label));
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .avatarUrl(req.getAvatarUrl())
                .city(req.getCity())
                .state(req.getState().toUpperCase())
                .userTypeId(userType.getId())
                .build();
        return userRepository.save(user);
    }

    public String login(LoginRequest req) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword());
        authenticationManager.authenticate(authToken);
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(req.getEmail().toLowerCase())
                .password("")
                .authorities("ROLE_USER")
                .build();
        return jwtService.generateToken(userDetails);
    }
}
