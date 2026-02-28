package com.tourism.booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "trip_categories")
@Data
public class TripCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false, unique = true)
    private String categoryName;

    private String description;
}
