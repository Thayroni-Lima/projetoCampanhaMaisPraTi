package com.projeto.campanhas.backend.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(min = 6, max = 60)
    private String password;

    @Size(max = 255)
    private String avatarUrl;

    @NotBlank
    @Size(max = 50)
    private String city;

    @NotBlank
    @Size(min = 2, max = 2)
    private String state;

    // Optional: NORMAL or ADMIN; default NORMAL if not provided
    @Size(max = 8)
    private String userTypeLabel;
}
