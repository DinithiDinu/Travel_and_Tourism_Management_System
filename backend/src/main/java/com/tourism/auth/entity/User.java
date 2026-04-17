package com.tourism.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String name;

    @Column(nullable = false)
    private String role; // TRAVELER, GUIDE, RIDER, ADMIN, PROVIDER

    @Column(nullable = false)
    private String accountStatus = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED

    private Integer starPoints = 0;
    private String memberTier = "BRONZE"; // BRONZE, SILVER, GOLD, PLATINUM

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.starPoints == null)
            this.starPoints = 0;
        if (this.memberTier == null)
            this.memberTier = "BRONZE";
    }
}
