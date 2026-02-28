package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tour_packages")
@Data
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packageId;

    @Column(nullable = false)
    private String packageName;

    private String description;
    private Double basePrice;
    private Integer duration; // days
    private String imageUrl;
    private String status = "ACTIVE";
}
