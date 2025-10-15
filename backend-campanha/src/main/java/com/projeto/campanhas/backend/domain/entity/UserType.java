package com.projeto.campanhas.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "user_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserType {
    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 8, nullable = false)
    private String label; // e.g., ADMIN, NORMAL

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
