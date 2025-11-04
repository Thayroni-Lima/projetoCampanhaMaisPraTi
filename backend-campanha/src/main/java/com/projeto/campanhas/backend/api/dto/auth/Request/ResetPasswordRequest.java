package com.projeto.campanhas.backend.api.dto.auth.Request;

public class ResetPasswordRequest {
    private String token;
    
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
