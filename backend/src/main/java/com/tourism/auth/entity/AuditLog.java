package com.tourism.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String action;

    private LocalDateTime actionTime;

    @PrePersist
    public void prePersist() {
        this.actionTime = LocalDateTime.now();
    }
}
