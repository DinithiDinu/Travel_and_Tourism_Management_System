package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_transactions")
@Data
public class FinancialTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private Long expenseId;
    private Long revenueId;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private String transactionType; // INCOME, EXPENSE

    @Column(nullable = false)
    private Double amount;

    private String description;
    private LocalDateTime transactionDate;

    @PrePersist
    public void prePersist() {
        this.transactionDate = LocalDateTime.now();
    }
}
