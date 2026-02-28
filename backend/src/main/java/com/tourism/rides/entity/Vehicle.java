package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    @Column(nullable = false)
    private Long riderId;

    private String vehicleType;

    @Column(name = "registration_number")
    private String vehicleNumber;

    private String model;
    private Integer year;

    @Column(name = "seating_capacity")
    private Integer capacity;

    private String status = "AVAILABLE";
}
