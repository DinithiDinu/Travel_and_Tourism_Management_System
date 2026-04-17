package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(nullable = false)
    private Long userId;

    private Long packageId;
    private Long bookingId;

    @Column(nullable = false)
    private Double amount;

    private String paymentMethod; // CARD, WALLET, CASH
    private String paymentStatus = "PENDING";
    private LocalDateTime transactionDate;

    @PrePersist
    public void prePersist() {
        this.transactionDate = LocalDateTime.now();
    }
}
