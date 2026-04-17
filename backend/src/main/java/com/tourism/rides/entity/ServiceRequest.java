package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(nullable = false)
    private Long userId;

    private String pickupLocation;

    @Column(name = "drop_location")
    private String dropoffLocation;

    private String serviceType;
    private String status = "PENDING";

    @Column(name = "requested_at")
    private LocalDateTime requestedDateTime;

    private Integer numberOfPeople;
    private String notes;

    @PrePersist
    public void prePersist() {
        if (this.requestedDateTime == null) {
            this.requestedDateTime = LocalDateTime.now();
        }
    }
}
