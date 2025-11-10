package com.projeto.campanhas.backend.api.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @Size(max = 100)
    private String name;

    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 255)
    private String avatarUrl;

    @Size(max = 50)
    private String city;

    @Size(min = 2, max = 2)
    private String state;

    // Para mudança de senha (opcional)
    @Size(min = 6, max = 60)
    private String currentPassword;

    @Size(min = 6, max = 60)
    private String newPassword;
}