package com.projeto.campanhas.backend.api.dto.auth.Response;

public class MessageResponse {
    private String message;
    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
