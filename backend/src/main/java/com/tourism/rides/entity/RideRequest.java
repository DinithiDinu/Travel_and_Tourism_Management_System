package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ride_requests")
@Data
public class RideRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;
    private String riderName;
    private String serviceType; // e.g., Car, Van, Bus
    private String status; // Pending, Assigned, Completed
}
