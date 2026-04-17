package com.tourism.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_resets")
@Data
public class PasswordReset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resetId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String resetToken;

    private LocalDateTime expiresAt;
    private boolean used = false;

    @PrePersist
    public void prePersist() {
        this.expiresAt = LocalDateTime.now().plusHours(1);
    }
}
