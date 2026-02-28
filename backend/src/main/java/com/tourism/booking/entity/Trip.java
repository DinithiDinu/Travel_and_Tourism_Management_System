package com.tourism.booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "trips")
@Data
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id")
    private Long id;

    @Column(name = "trip_name")
    private String title;

    @Column(name = "trip_description")
    private String description;

    private String location;

    @Column(name = "duration_days")
    private Integer durationDays;

    private Integer capacity;
    private Double price;

    private String category;
    private String difficulty;

    @Column(name = "image_url")
    private String imageUrl;

    private String status = "ACTIVE";
}
