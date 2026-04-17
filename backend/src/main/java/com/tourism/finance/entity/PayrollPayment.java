package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "payroll_payments")
@Data
public class PayrollPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payrollId;

    @Column(nullable = false)
    private Long employeeId;

    @Column(name = "amount_paid")
    private Double amount;

    @Column(name = "paid_date")
    private LocalDate paymentDate;

    private String paymentMethod;
    private String status;
}
