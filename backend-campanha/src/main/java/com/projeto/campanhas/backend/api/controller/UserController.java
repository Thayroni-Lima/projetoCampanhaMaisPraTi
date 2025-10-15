package com.projeto.campanhas.backend.api.controller;

import com.projeto.campanhas.backend.api.dto.user.UserResponse;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.domain.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserRepository userRepository;

    private static UserResponse toResponse(User user) {
        String label = null; // avoid touching lazy relation here
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatarUrl(), user.getCity(), user.getState(), label);
    }

    @Operation(summary = "Listar usuários ou buscar por email (?email=)")
    @GetMapping
    public ResponseEntity<List<UserResponse>> list(@RequestParam(value = "email", required = false) String email) {
        if (email != null && !email.isBlank()) {
            return ResponseEntity.ok(userRepository.findByEmail(email.toLowerCase())
                    .map(u -> java.util.List.of(toResponse(u)))
                    .orElse(java.util.List.of()));
        }
        List<UserResponse> list = userRepository.findAll().stream().map(UserController::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Obter usuário logado")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        UserResponse resp = toResponse(user);
        return ResponseEntity.ok(resp);
    }
}
