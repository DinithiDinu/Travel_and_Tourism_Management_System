package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "revenues")
@Data
public class Revenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long revenueId;

    @Column(name = "revenue_amount")
    private Double amount;

    private String source;
    private LocalDate revenueDate;
    private String description;
    private String category;
}
