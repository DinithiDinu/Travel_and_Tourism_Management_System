package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Data
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    private Long riderId;
    private Long serviceProviderId;

    private String assignmentLocation;
    private LocalDateTime assignmentTime;
    private String status = "ACTIVE";

    @PrePersist
    public void prePersist() {
        this.assignmentTime = LocalDateTime.now();
    }
}
