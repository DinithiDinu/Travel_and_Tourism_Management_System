package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "coin_redemptions")
@Data
public class CoinRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long redemptionId;

    @Column(nullable = false)
    private Long userId;

    private Integer coinsUsed;
    private Double discountAmount;
    private LocalDate redemptionDate;

    @PrePersist
    public void prePersist() {
        this.redemptionDate = LocalDate.now();
    }
}
