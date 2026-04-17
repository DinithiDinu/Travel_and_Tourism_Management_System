package com.tourism.rides.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_providers")
@Data
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceProviderId;

    private Long userId;
    private String serviceType;

    @Column(name = "business_name")
    private String name;

    private String contactEmail;
    private String phone;
    private String address;
    private String status = "ACTIVE";
}
