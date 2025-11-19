package com.projeto.campanhas.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "campaigns", indexes = {
        @Index(name = "campaigns_user_id_fkey", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal goal;

    @Column(nullable = false, name = "deadline")
    private Instant deadline; // using Instant for DateTime(0)

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(length = 120, nullable = false)
    private String preview;

    @Column(length = 50, nullable = false)
    private String category;

    @Column(length = 50, nullable = false)
    private String city;

    @Column(length = 20, nullable = false)
    private String state;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "donations_count", nullable = false)
    private Integer donationsCount;

    // Soma total das doações em dinheiro
    @Column(name = "amount_raised", nullable = true, precision = 12, scale = 2)
    private BigDecimal amountRaised;

    @PrePersist
    public void prePersist() {
        if (this.id == null) this.id = UUID.randomUUID().toString();
        if (this.createdAt == null) this.createdAt = Instant.now();
        if (this.updatedAt == null) this.updatedAt = Instant.now();
        if (this.donationsCount == null) this.donationsCount = 0;
        if (this.amountRaised == null) this.amountRaised = BigDecimal.ZERO;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
