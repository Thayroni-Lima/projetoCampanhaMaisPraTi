package com.projeto.campanhas.backend.api.controller;

import com.projeto.campanhas.backend.api.dto.auth.AuthResponse;
import com.projeto.campanhas.backend.api.dto.auth.LoginRequest;
import com.projeto.campanhas.backend.api.dto.auth.RegisterRequest;
import com.projeto.campanhas.backend.api.dto.user.UserResponse;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registrar novo usuário")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        String label = user.getUserType() != null ? user.getUserType().getLabel() : null;
        UserResponse resp = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), user.getCity(), user.getState(), label);
        return ResponseEntity.ok(resp);
    }

    @Operation(summary = "Login e geração de JWT")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
