package com.projeto.campanhas.backend.api.dto.auth.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {
    
    @NotBlank(message = "Token é obrigatório")
    private String token;
    
    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String newPassword;

    public void setToken(String token) {
        this.token = token;
    }
    
    public String getToken() {
        return token;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
}
