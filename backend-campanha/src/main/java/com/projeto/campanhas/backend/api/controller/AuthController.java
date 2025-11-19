package com.projeto.campanhas.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.campanhas.backend.api.dto.auth.AuthResponse;
import com.projeto.campanhas.backend.api.dto.auth.LoginRequest;
import com.projeto.campanhas.backend.api.dto.auth.RegisterRequest;
import com.projeto.campanhas.backend.api.dto.auth.Request.RecoverPasswordRequest;
import com.projeto.campanhas.backend.api.dto.auth.Request.ResetPasswordRequest;
import com.projeto.campanhas.backend.api.dto.auth.Response.MessageResponse;
import com.projeto.campanhas.backend.api.dto.user.UserResponse;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.service.AuthService;
import com.projeto.campanhas.backend.service.PasswordResetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @Operation(summary = "Registrar novo usuário")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        String label = user.getUserType() != null ? user.getUserType().getLabel() : null;
        UserResponse resp = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.getCity(),
            user.getState(),
            label
        );
        return ResponseEntity.ok(resp);
    }

    @Operation(summary = "Login e geração de JWT")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    // Recuperação e redefinição de senha

    @Operation(summary = "Recuperar senha")
    @PostMapping("/recover-password")
    public MessageResponse recoverPassword(@RequestBody RecoverPasswordRequest req) {
        passwordResetService.initiatePasswordReset(req.getEmail());
        return new MessageResponse("Link de redefinição de senha enviado para o e-mail.");
    }

    @Operation(summary = "Validar token de redefinição de senha")
    @GetMapping("/reset-password")
    public MessageResponse validateToken(@RequestParam String token) {
        boolean valid = passwordResetService.validateToken(token);
        if (!valid) {
            throw new RuntimeException("Token inválido ou expirado.");
        }
        return new MessageResponse("Token válido.");
    }

    @Operation(summary = "Redefinir senha")
    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        passwordResetService.resetPassword(req.getToken(), req.getNewPassword());
        return new MessageResponse("Senha redefinida com sucesso!");
    }
}
