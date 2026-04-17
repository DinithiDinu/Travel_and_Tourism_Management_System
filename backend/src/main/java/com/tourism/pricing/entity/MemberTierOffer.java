package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "member_tier_offers")
@Data
public class MemberTierOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long offerId;

    @Column(nullable = false)
    private String offerName;

    @Column(nullable = false)
    private String targetTier; // ALL, NEW_MEMBER, BRONZE, SILVER, GOLD, PLATINUM

    @Column(nullable = false)
    private Double discountPercentage;

    private String description;

    private boolean isHoliday = false; // Holiday offers apply to all tiers

    private boolean active = true;

    private LocalDate startDate;
    private LocalDate endDate;

    @PrePersist
    public void prePersist() {
        if (this.startDate == null)
            this.startDate = LocalDate.now();
    }
}
