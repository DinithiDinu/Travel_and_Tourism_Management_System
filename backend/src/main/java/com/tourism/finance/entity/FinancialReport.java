package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "financial_reports")
@Data
public class FinancialReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @Column(name = "report_period")
    private String reportType;

    private LocalDate startDate;
    private LocalDate endDate;
    private String generatedBy;
    private Double totalRevenue;
    private Double totalExpense;
    private Double netProfit;

    @Column(name = "generated_date")
    private LocalDate generatedDate;

    @PrePersist
    public void prePersist() {
        this.generatedDate = LocalDate.now();
        if (this.totalRevenue != null && this.totalExpense != null) {
            this.netProfit = this.totalRevenue - this.totalExpense;
        }
    }
}
