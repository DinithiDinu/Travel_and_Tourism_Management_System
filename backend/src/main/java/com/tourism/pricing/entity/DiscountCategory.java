package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "discount_categories")
@Data
public class DiscountCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discountId;

    @Column(nullable = false)
    private String roleType; // TRAVELER, GUIDE, etc.

    @Column(nullable = false)
    private Double discountPercentage;

    private String description;
}
