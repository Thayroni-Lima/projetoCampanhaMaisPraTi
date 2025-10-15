package com.projeto.campanhas.backend.api.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String avatarUrl;
    private String city;
    private String state;
    private String userTypeLabel;
}
