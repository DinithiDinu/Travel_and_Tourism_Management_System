package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rider_profiles")
@Data
public class RiderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long riderId;

    private Long userId;
    private String name;
    private String licenseNumber;
    private String phone;
    private String vehicleType;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    private String status = "AVAILABLE";
}
