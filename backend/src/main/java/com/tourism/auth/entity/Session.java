package com.tourism.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 512)
    private String token;

    private LocalDateTime loginTime;
    private LocalDateTime expiryTime;

    @PrePersist
    public void prePersist() {
        this.loginTime = LocalDateTime.now();
        this.expiryTime = LocalDateTime.now().plusDays(1);
    }
}
