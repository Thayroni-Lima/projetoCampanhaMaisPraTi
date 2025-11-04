package com.projeto.campanhas.backend.domain.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private Instant expiration;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setExpiration(Instant expiration) {
        this.expiration = expiration;
    }

    public Instant getExpiration() {
        return expiration;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public PasswordResetToken() {}

    public PasswordResetToken(String token, Instant expiration, User user) {
        this.token = token;
        this.expiration = expiration;
        this.user = user;
    }

    
}
