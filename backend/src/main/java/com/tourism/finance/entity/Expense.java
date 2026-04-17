package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenseId;

    @Column(name = "expense_amount")
    private Double amount;

    private String description;
    private String category;
    private LocalDate expenseDate;
    private String status = "PENDING";
}
