package com.tourism.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeId;

    private Long userId;
    private String name;
    private String department;
    private String position;

    @Column(name = "base_salary")
    private Double salary;

    private LocalDate hireDate;
    private String status = "ACTIVE";
}
