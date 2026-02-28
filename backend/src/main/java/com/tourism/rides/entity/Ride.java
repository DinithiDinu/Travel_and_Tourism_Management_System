package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Data
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rideId;

    @Column(nullable = false)
    private Long requestId;

    private Long riderId;
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, CANCELLED
    private Double fare;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @PrePersist
    public void prePersist() {
        this.startTime = LocalDateTime.now();
    }
}
