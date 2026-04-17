package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "service_provider_payments")
@Data
public class ServiceProviderPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long providerPaymentId;

    @Column(nullable = false)
    private Long providerId;

    @Column(nullable = false)
    private Double amount;

    private LocalDate paymentDate;
    private String status; // PAID, PENDING
    private String serviceType;
}
