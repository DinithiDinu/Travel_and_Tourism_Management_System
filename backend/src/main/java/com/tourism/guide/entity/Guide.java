package com.tourism.guide.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "guides")
@Data
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guideId;

    private Long userId;
    private String name;
    private String licenseNumber;
    private String specialization;

    @Column(name = "languages")
    private String languagesSpoken;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "certification_level")
    private String certificationLevel;

    @Column(name = "contact_email")
    private String contactEmail;

    private String phone;
    private String bio;
    private String status = "ACTIVE";
}
