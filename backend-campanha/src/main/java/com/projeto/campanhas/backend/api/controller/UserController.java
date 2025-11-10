package com.projeto.campanhas.backend.api.controller;

import com.projeto.campanhas.backend.api.dto.user.UserResponse;
import com.projeto.campanhas.backend.api.dto.user.UserUpdateRequest;
import com.projeto.campanhas.backend.domain.entity.User;
import com.projeto.campanhas.backend.domain.repository.UserRepository;
import com.projeto.campanhas.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

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
        List<UserResponse> list = userRepository.findAll().stream()
                .map(UserController::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Obter usuário logado")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(toResponse(user));
    }

    @Operation(summary = "Atualizar dados do usuário logado")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@Valid @RequestBody UserUpdateRequest request) {
        User updatedUser = userService.updateCurrentUser(request);
        return ResponseEntity.ok(toResponse(updatedUser));
    }

    @Operation(summary = "Deletar usuário logado")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe() {
        userService.deleteCurrentUser();
        return ResponseEntity.noContent().build();
    }
}