package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ride_locations")
@Data
public class RideLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(nullable = false)
    private Long rideId;

    private Double latitude;
    private Double longitude;
    private String locationName;
}
