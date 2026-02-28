package com.tourism.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_activity_logs")
@Data
public class StaffActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    @Column(nullable = false)
    private Long userId;

    private String activityDescription;
    private LocalDateTime activityTime;

    @PrePersist
    public void prePersist() {
        this.activityTime = LocalDateTime.now();
    }
}
