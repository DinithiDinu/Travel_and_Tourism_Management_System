package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "package_offers")
@Data
public class PackageOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long offerId;

    @Column(nullable = false)
    private Long packageId;

    @Column(nullable = false)
    private String offerName;

    private String discountType; // PERCENTAGE, FIXED
    private Double value;
    private LocalDate startDate;
    private LocalDate endDate;
}
